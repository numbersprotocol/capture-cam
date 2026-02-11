import { NgModule } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from '../../shared/shared.module';
import { WalletsPageRoutingModule } from './wallets-routing.module';
import { WalletsPage } from './wallets.page';

@NgModule({
  imports: [SharedModule, WalletsPageRoutingModule, QRCodeModule],
  declarations: [WalletsPage],
})
export class WalletsPageModule {}
