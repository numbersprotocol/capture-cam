import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OnboardingService } from '../../../../shared/onboarding/onboarding.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements AfterViewInit {
  isLastSlide = false;

  @ViewChild('swiper') swiperRef?: ElementRef;

  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly navController: NavController
  ) {
    this.onboardingService.onboard$().pipe(untilDestroyed(this)).subscribe();
  }

  ngAfterViewInit() {
    // Angular's (swiperslidechange) binding doesn't work with web components
    // Use Swiper's instance event system instead
    const swiperEl = this.swiperRef?.nativeElement;
    const SWIPER_CHECK_INTERVAL_MS = 50;
    if (swiperEl) {
      // Wait for Swiper to initialize
      const checkSwiper = () => {
        if (swiperEl.swiper) {
          swiperEl.swiper.on('slideChange', () => {
            this.onSlideChange();
          });
        } else {
          setTimeout(checkSwiper, SWIPER_CHECK_INTERVAL_MS);
        }
      };
      checkSwiper();
    }
  }

  onSlideChange() {
    if (!this.swiperRef?.nativeElement?.swiper) {
      return;
    }

    const swiper = this.swiperRef.nativeElement.swiper;
    const curSlideIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    this.isLastSlide = curSlideIndex === totalSlides - 1;
  }

  skipSlides() {
    if (!this.swiperRef?.nativeElement?.swiper) {
      return;
    }

    const swiper = this.swiperRef.nativeElement.swiper;
    const totalSlides = swiper.slides.length;
    swiper.slideTo(totalSlides - 1);
  }

  closeTutorialPage() {
    this.navController.back();
  }
}
