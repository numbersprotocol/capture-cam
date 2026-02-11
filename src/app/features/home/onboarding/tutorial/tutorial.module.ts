import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { TutorialPageRoutingModule } from './tutorial-routing.module';
import { TutorialPage } from './tutorial.page';

@NgModule({
  imports: [TutorialPageRoutingModule, SharedModule],
  declarations: [TutorialPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TutorialPageModule {}
