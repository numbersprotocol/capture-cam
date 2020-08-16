import { Plugins } from '@capacitor/core';
import { BehaviorSubject, defer, Observable, of } from 'rxjs';
import { concatMapTo, map, mapTo, pluck, switchMap, tap } from 'rxjs/operators';

const { Storage } = Plugins;

export class Preferences {

  constructor(readonly name: string) { }

  private readonly subjects = new Map<string, BehaviorSubject<any>>();

  get$<T>(key: string, defaultValue: T, converter: (str: string) => T = JSON.parse): Observable<T> {
    return defer(() => of(this.subjects.has(key))).pipe(
      switchMap(existed => {
        if (!existed) { return this._get$(key, defaultValue, converter); }
        return of(existed);
      }),
      // tslint:disable-next-line: no-non-null-assertion
      concatMapTo(defer(() => this.subjects.get(key)!.asObservable()))
    );
  }

  private _get$<T>(key: string, defaultValue: T, converter: (str: string) => T): Observable<T> {
    return defer(() => Storage.get({ key: `${this.name}_${key}` })).pipe(
      pluck('value'),
      map(value => (value && value !== '[null]') ? converter(value) : defaultValue),
      tap(converted => this.updateSubjects(key, converted))
    );
  }

  getBoolean$(key: string, defaultValue: boolean = false) {
    return this.get$(key, defaultValue, (v) => v === 'true');
  }

  getNumber$(key: string, defaultValue: number = 0) {
    return this.get$(key, defaultValue, Number);
  }

  getString$(key: string, defaultValue: string = '') {
    return this.get$(key, defaultValue, (v) => v);
  }

  set$<T>(key: string, value: T, converter: (value: T) => string = JSON.stringify): Observable<T> {
    return defer(() => Storage.set({ key: `${this.name}_${key}`, value: converter(value) })).pipe(
      mapTo(this.updateSubjects(key, value)),
      mapTo(value)
    );
  }

  setBoolean$(key: string, value: boolean) {
    return this.set$(key, value, String);
  }

  setNumber$(key: string, value: number) {
    return this.set$(key, value, String);
  }

  setString$(key: string, value: string) {
    return this.set$(key, value, (v) => v);
  }

  private updateSubjects<T>(key: string, value: T) {
    if (this.subjects.has(key)) { this.subjects.get(key)?.next(value); }
    else { this.subjects.set(key, new BehaviorSubject(value)); }
  }
}
