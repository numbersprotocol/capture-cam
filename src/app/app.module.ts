import { DOCUMENT } from '@angular/common';
import { inject, NgModule, NgZone, provideAppInitializer } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { initialize } from '@ionic/core/components';
import type { IonicConfig } from '@ionic/core/components';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HammerModule } from './shared/hammer/hammer.module';
import { TranslocoRootModule } from './shared/language/transloco/transloco-root.module';
import { SharedModule } from './shared/shared.module';
import { provideUserGuideTour } from './shared/user-guide/user-guide.module';

const ionicConfig: IonicConfig = { mode: 'md' };

function initializeIonicStandaloneRuntime() {
  const doc = inject(DOCUMENT);
  const zone = inject(NgZone);
  doc.documentElement.classList.add('ion-ce');
  initialize({
    ...ionicConfig,
    _zoneGate: (handler: () => unknown) => zone.run(handler),
  });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(ionicConfig),
    AppRoutingModule,
    TranslocoRootModule,
    FormlyModule.forRoot({ extras: { lazyRender: true } }),
    FormlyMaterialModule,
    HammerModule,
  ],
  providers: [
    provideUserGuideTour(),
    provideAppInitializer(initializeIonicStandaloneRuntime),
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
