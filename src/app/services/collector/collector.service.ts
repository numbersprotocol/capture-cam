import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { EMPTY } from 'rxjs';
import { catchError, map, pluck, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { subscribeInBackground } from 'src/app/utils/background-task/background-task';
import { fileNameWithoutExtension } from 'src/app/utils/file/file';
import { MimeType } from 'src/app/utils/mime-type';
import { forkJoinWithDefault } from 'src/app/utils/rx-operators';
import { Proof } from '../data/proof/proof';
import { ProofRepository } from '../data/proof/proof-repository.service';
import { NotificationService } from '../notification/notification.service';
import { InformationProvider } from './information/information-provider';
import { SignatureProvider } from './signature/signature-provider';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {

  private readonly informationProviders = new Set<InformationProvider>();
  private readonly signatureProviders = new Set<SignatureProvider>();

  constructor(
    private readonly proofRepository: ProofRepository,
    private readonly notificationService: NotificationService,
    private readonly translocoService: TranslocoService
  ) { }

  storeAndCollect(rawBase64: string, mimeType: MimeType) {
    // Deliberately store proof and its media file in the foreground, so the app page can
    // correctly and continuously subscribe the Storage.getAll$().
    this.store$(rawBase64, mimeType).subscribe(proof => {
      subscribeInBackground(this.collectAndSign$(proof));
    });
  }

  private store$(rawBase64: string, mimeType: MimeType) {
    return this.proofRepository.saveRawFile$(rawBase64, mimeType).pipe(
      // Get the proof hash from the uri.
      map(uri => fileNameWithoutExtension(uri)),
      // Store the media file.
      switchMap(hash => this.proofRepository.add$({ hash, mimeType, timestamp: Date.now() })),
      pluck(0)
    );
  }

  private collectAndSign$(proof: Proof) {
    const notificationId = this.notificationService.createNotificationId();
    this.notificationService.notify(
      notificationId,
      this.translocoService.translate('collectingProof'),
      this.translocoService.translate('collectingInformation')
    );
    return forkJoinWithDefault([...this.informationProviders].map(provider => provider.collectAndStore$(proof))).pipe(
      tap(_ => this.notificationService.notify(
        notificationId,
        this.translocoService.translate('collectingProof'),
        this.translocoService.translate('signingProof')
      )),
      switchMapTo(forkJoinWithDefault([...this.signatureProviders].map(provider => provider.signAndStore$(proof)))),
      tap(_ => this.notificationService.cancel(notificationId)),
      catchError(error => {
        this.notificationService.notifyError(notificationId, error);
        return EMPTY;
      })
    );
  }

  addInformationProvider(...providers: InformationProvider[]) {
    providers.forEach(provider => this.informationProviders.add(provider));
  }

  removeInformationProvider(...providers: InformationProvider[]) {
    providers.forEach(provider => this.informationProviders.delete(provider));
  }

  addSignatureProvider(...providers: SignatureProvider[]) {
    providers.forEach(provider => this.signatureProviders.add(provider));
  }

  removeSignatureProvider(...providers: SignatureProvider[]) {
    providers.forEach(provider => this.signatureProviders.delete(provider));
  }
}
