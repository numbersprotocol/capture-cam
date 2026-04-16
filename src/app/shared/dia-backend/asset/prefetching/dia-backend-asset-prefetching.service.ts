import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MediaStore } from '../../../media/media-store/media-store.service';
import { DiaBackendAssetRepository } from '../dia-backend-asset-repository.service';
import { DiaBackendAssetDownloadingService } from '../downloading/dia-backend-downloading.service';

@Injectable({
  providedIn: 'root',
})
export class DiaBackendAssetPrefetchingService {
  private readonly batchSize = 5;

  constructor(
    private readonly assetRepository: DiaBackendAssetRepository,
    private readonly downloadingService: DiaBackendAssetDownloadingService,
    private readonly mediaStore: MediaStore
  ) {}

  async prefetch(
    onStored: (currentCount: number, totalCount: number) => any = () => void 0
  ) {
    let currentOffset = 0;
    let currentCount = 0;
    const limit = 100;
    while (true) {
      const { results: diaBackendAssets, count: totalCount } =
        await firstValueFrom(
          this.assetRepository.fetchOriginallyOwned$({
            offset: currentOffset,
            limit,
          })
        );

      if (diaBackendAssets.length === 0) {
        break;
      }
      for (let i = 0; i < diaBackendAssets.length; i += this.batchSize) {
        const batch = diaBackendAssets.slice(i, i + this.batchSize);
        await Promise.all(
          batch.map(async diaBackendAsset => {
            if (diaBackendAsset.source_transaction === null)
              await this.downloadingService.storeRemoteCapture(
                diaBackendAsset,
                (await this.mediaStore.getThumbnail(
                  diaBackendAsset.proof_hash
                )) === undefined
              );
          })
        );
        currentCount += batch.length;
        onStored(currentCount, totalCount);
      }
      currentOffset += diaBackendAssets.length;
    }
  }
}
