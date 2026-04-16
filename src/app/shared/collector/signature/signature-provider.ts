import { CameraSource } from '@capacitor/camera';
import { Signature } from '../../repositories/proof/proof';

export interface SignatureProvider {
  readonly id: string;
  idFor(source: CameraSource): string;
  provide(serializedSortedSignedTargets: string): Promise<Signature>;
}
