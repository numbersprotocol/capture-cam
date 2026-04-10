import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { EMPTY, defer, iif } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { reloadApp } from '../../utils/miscellaneous';
import { BlockingActionService } from '../blocking-action/blocking-action.service';
import { ConfirmAlert } from '../confirm-alert/confirm-alert.service';
import { Database } from '../database/database.service';
import { ErrorService } from '../error/error.service';
import { MediaStore } from '../media/media-store/media-store.service';
import { PreferenceManager } from '../preference-manager/preference-manager.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private readonly mediaStore: MediaStore,
    private readonly database: Database,
    private readonly preferenceManager: PreferenceManager,
    private readonly errorService: ErrorService,
    private readonly confirmAlert: ConfirmAlert,
    private readonly blockingActionService: BlockingActionService,
    private readonly translocoService: TranslocoService
  ) {}

  wipeAndReload$() {
    return defer(() => this.mediaStore.clear()).pipe(
      concatMap(() => defer(() => this.database.clear())),
      concatMap(() => defer(() => this.preferenceManager.clear())),
      concatMap(() => defer(reloadApp)),
      catchError((err: unknown) => this.errorService.toastError$(err))
    );
  }

  logout$() {
    return defer(() =>
      this.confirmAlert.present({
        message: this.translocoService.translate('message.confirmLogout'),
      })
    ).pipe(
      concatMap(result =>
        iif(() => result, this.blockingActionService.run$(this.wipeAndReload$()), EMPTY)
      )
    );
  }
}
