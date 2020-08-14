import { Observable, of, zip } from 'rxjs';
import { filter, first, map, switchMap, switchMapTo } from 'rxjs/operators';
import { Proof } from 'src/app/services/data/proof/proof';
import { Signature } from 'src/app/services/data/signature/signature';
import { createEcKeyPair$, signWithSha256AndEcdsa$ } from 'src/app/utils/crypto/crypto';
import { PreferenceManager } from 'src/app/utils/preferences/preference-manager';
import { SignatureProvider } from '../signature-provider';

const preferences = PreferenceManager.DEFAULT_SIGNATURE_PROVIDER_PREF;
const enum PrefKeys {
  PublicKey = 'publicKey',
  PrivateKey = 'privateKey'
}

export class DefaultSignatureProvider extends SignatureProvider {

  readonly name = 'Web Crypto API';

  static initialize$() {
    return zip(
      this.getPublicKey$(),
      this.getPrivateKey$()
    ).pipe(
      first(),
      filter(([publicKey, privateKey]) => publicKey.length === 0 || privateKey.length === 0),
      switchMapTo(createEcKeyPair$()),
      switchMap(({ publicKey, privateKey }) => zip(
        preferences.setString$(PrefKeys.PublicKey, publicKey),
        preferences.setString$(PrefKeys.PrivateKey, privateKey)
      ))
    );
  }

  static getPublicKey$() {
    return preferences.getString$(PrefKeys.PublicKey);
  }

  static getPrivateKey$() {
    return preferences.getString$(PrefKeys.PrivateKey);
  }

  protected provide$(proof: Proof, serialized: string): Observable<Signature> {
    return DefaultSignatureProvider.getPrivateKey$().pipe(
      first(),
      switchMap(privateKeyHex => signWithSha256AndEcdsa$(serialized, privateKeyHex)),
      switchMap(signatureHex => zip(of(signatureHex), DefaultSignatureProvider.getPublicKey$())),
      first(),
      map(([signatureHex, publicKeyHex]) => ({
        proofHash: proof.hash,
        provider: this.name,
        signature: signatureHex,
        publicKey: publicKeyHex
      }))
    );
  }
}
