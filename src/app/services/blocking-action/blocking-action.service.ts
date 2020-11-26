import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { TranslocoService } from '@ngneat/transloco';
import { defer, Observable, of, zip } from 'rxjs';
import { catchError, map, switchMap, switchMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BlockingActionService {
  constructor(
    private readonly loadingController: LoadingController,
    private readonly translocoService: TranslocoService
  ) {}

  run$<T>(
    action$: Observable<T>,
    opts: Partial<LoadingOptions> = {
      message: this.translocoService.translate('message.pleaseWait'),
    }
  ) {
    return defer(() =>
      this.loadingController.create({
        mode: 'md',
        ...opts,
      })
    ).pipe(switchMap(loading => this._run$(action$, loading)));
  }

  private _run$<T>(action$: Observable<T>, loading: HTMLIonLoadingElement) {
    return defer(() => loading.present()).pipe(
      switchMapTo(action$),
      catchError(err => {
        loading.dismiss();
        throw err;
      }),
      switchMap(result =>
        zip(
          defer(() => loading.dismiss()),
          of(result)
        )
      ),
      map(([_, result]) => result)
    );
  }
}
