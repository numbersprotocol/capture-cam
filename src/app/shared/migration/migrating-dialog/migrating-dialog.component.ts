import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-migrating-dialog',
  templateUrl: './migrating-dialog.component.html',
  styleUrls: ['./migrating-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MigratingDialogComponent {}
