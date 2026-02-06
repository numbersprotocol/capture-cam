import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Clipboard } from '@capacitor/clipboard';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-export-private-key-modal',
  templateUrl: './export-private-key-modal.component.html',
  styleUrls: ['./export-private-key-modal.component.scss'],
})
export class ExportPrivateKeyModalComponent {
  readonly privateKey: string = '';

  constructor(
    private readonly dialogRef: MatDialogRef<ExportPrivateKeyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogData,
    private readonly translocoService: TranslocoService,
    private readonly snackBar: MatSnackBar
  ) {
    this.privateKey = data.privateKey;
  }

  async copyToClipboard(privateKey: string) {
    await Clipboard.write({ string: privateKey });
    this.snackBar.open(
      this.translocoService.translate('message.copiedToClipboard')
    );
    this.dialogRef.close();
  }
}

interface MatDialogData {
  privateKey: string;
}
