import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transfer-loading',
  templateUrl: './transfer-loading.component.html',
  styleUrls: ['./transfer-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TransferLoadingComponent {
  mode: 'deposit' | 'withdraw';

  constructor(@Inject(MAT_DIALOG_DATA) public data: 'deposit' | 'withdraw') {
    this.mode = data;
  }
}
