import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, zip } from 'rxjs';
import { concatMap, concatMapTo, first, map, pluck } from 'rxjs/operators';
import { base64ToBlob$ } from 'src/app/utils/encoding/encoding';
import { PreferenceManager } from 'src/app/utils/preferences/preference-manager';
import { secret } from '../../../../environments/secret';
import { Proof } from '../../data/proof/proof';
import { Signature } from '../../data/signature/signature';
import { SerializationService } from '../../serialization/serialization.service';
import { Asset } from './data/asset/asset';

export const enum TargetProvider {
  Numbers = 'Numbers'
}

const baseUrl = secret.numbersStorageBaseUrl;
const preference = PreferenceManager.NUMBERS_STORAGE_PUBLISHER_PREF;
const enum PrefKeys {
  Enabled = 'enabled',
  AuthToken = 'authToken',
  UserName = 'userName',
  Email = 'email'
}

@Injectable({
  providedIn: 'root'
})
export class NumbersStorageApi {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly serializationService: SerializationService
  ) { }

  isEnabled$() {
    return preference.getBoolean$(PrefKeys.Enabled);
  }

  getUserName$() {
    return preference.getString$(PrefKeys.UserName);
  }

  getEmail$() {
    return preference.getString$(PrefKeys.Email);
  }

  createUser$(
    userName: string,
    email: string,
    password: string
  ) {
    const formData = new FormData();
    formData.append('username', userName);
    formData.append('email', email);
    formData.append('password', password);
    return this.httpClient.post<User>(`${baseUrl}/auth/users/`, formData);
  }

  login$(
    email: string,
    password: string
  ) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return this.httpClient.post<TokenCreate>(`${baseUrl}/auth/token/login/`, formData).pipe(
      pluck('auth_token'),
      concatMap(authToken => preference.setString$(PrefKeys.AuthToken, `token ${authToken}`)),
      concatMapTo(this.getUserInformation$()),
      concatMap(user => zip(
        preference.setString$(PrefKeys.UserName, user.username),
        preference.setString$(PrefKeys.Email, user.email)
      )),
      concatMapTo(preference.setBoolean$(PrefKeys.Enabled, true))
    );
  }

  getUserInformation$() {
    return preference.getString$(PrefKeys.AuthToken).pipe(
      first(),
      map(authToken => new HttpHeaders({ Authorization: authToken })),
      concatMap(headers => this.httpClient.get<User>(`${baseUrl}/auth/users/me/`, { headers }))
    );
  }

  logout$() {
    return preference.setBoolean$(PrefKeys.Enabled, false).pipe(
      concatMapTo(preference.getString$(PrefKeys.AuthToken)),
      first(),
      map(authToken => new HttpHeaders({ Authorization: authToken })),
      concatMap(headers => this.httpClient.post(`${baseUrl}/auth/token/logout/`, new FormData(), { headers })),
      concatMap(() => zip(
        preference.setString$(PrefKeys.UserName, 'has-logged-out'),
        preference.setString$(PrefKeys.Email, 'has-logged-out'),
        preference.setString$(PrefKeys.AuthToken, '')
      ))
    );
  }

  createAsset$(
    rawFileBase64: string,
    proof: Proof,
    targetProvider: TargetProvider,
    caption: string,
    signatures: Signature[],
    tag: string
  ) {
    return preference.getString$(PrefKeys.AuthToken).pipe(
      first(),
      concatMap(authToken => zip(
        base64ToBlob$(rawFileBase64),
        this.serializationService.stringify$(proof),
        of(authToken)
      )),
      concatMap(([rawFile, information, authToken]) => {
        const headers = new HttpHeaders({ Authorization: authToken });
        const formData = new FormData();
        formData.append('asset_file', rawFile);
        formData.append('asset_file_mime_type', proof.mimeType);
        formData.append('meta', information);
        formData.append('target_provider', targetProvider);
        formData.append('caption', caption);
        formData.append('signature', JSON.stringify(signatures));
        formData.append('tag', tag);
        return this.httpClient.post<Asset>(`${baseUrl}/api/v2/assets/`, formData, { headers });
      })
    );
  }
}

interface User {
  readonly username: string;
  readonly email: string;
  readonly id: number;
}

interface TokenCreate {
  readonly auth_token: string;
}
