import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-transfer-loading',
  templateUrl: './transfer-loading.component.html',
  styleUrls: ['./transfer-loading.component.scss'],
})
export class TransferLoadingComponent {
  mode: 'deposit' | 'withdraw';

  constructor(@Inject(MAT_DIALOG_DATA) public data: 'deposit' | 'withdraw') {
    this.mode = data;
  }
}
