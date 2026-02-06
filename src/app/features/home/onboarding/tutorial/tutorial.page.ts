import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OnboardingService } from '../../../../shared/onboarding/onboarding.service';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage {
  isLastSlide = false;

  @ViewChild('swiper') swiperRef?: ElementRef;

  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly navController: NavController
  ) {
    this.onboardingService.onboard$().pipe(untilDestroyed(this)).subscribe();
  }

  onSlideChange() {
    if (!this.swiperRef?.nativeElement?.swiper) return;

    const swiper = this.swiperRef.nativeElement.swiper;
    const curSlideIndex = swiper.activeIndex;
    const totalSlides = swiper.slides.length;

    this.isLastSlide = curSlideIndex === totalSlides - 1;
  }

  skipSlides() {
    if (!this.swiperRef?.nativeElement?.swiper) return;

    const swiper = this.swiperRef.nativeElement.swiper;
    const totalSlides = swiper.slides.length;
    swiper.slideTo(totalSlides - 1);
  }

  closeTutorialPage() {
    this.navController.back();
  }
}
