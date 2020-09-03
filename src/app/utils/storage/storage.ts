import { FilesystemDirectory, FilesystemEncoding, Plugins } from '@capacitor/core';
import { BehaviorSubject, defer, from, Observable, of } from 'rxjs';
import { catchError, concatMap, concatMapTo, map, mapTo, pluck, tap, toArray } from 'rxjs/operators';
import { sha256$ } from '../crypto/crypto';
import { forkJoinWithDefault } from '../rx-operators';

const { Filesystem } = Plugins;

export class Storage<T extends object> {

  constructor(
    readonly name: string,
    readonly directory: FilesystemDirectory = FilesystemDirectory.Data
  ) { }

  private readonly tuples$ = new BehaviorSubject<T[]>([]);
  private hasInitialized = false;

  private checkInitialization$() {
    return defer(() => {
      if (this.hasInitialized) { return of(void 0); }
      else { return this.refresh$(); }
    });
  }

  private refresh$() {
    return of(void 0).pipe(
      tap(_ => this.hasInitialized = true),
      concatMapTo(this.makeNameDir$()),
      concatMapTo(this.readNameDir$()),
      pluck('files'),
      concatMap(fileNames => from(fileNames)),
      concatMap(fileName => this.readFile$(fileName)),
      map(result => JSON.parse(result.data) as T),
      toArray(),
      tap(tuples => this.tuples$.next(tuples))
    );
  }

  private makeNameDir$(): Observable<void> {
    return defer(() => Filesystem.mkdir({
      path: this.name,
      directory: this.directory,
      recursive: true
    })).pipe(
      mapTo(void 0),
      catchError((err: Error) => {
        console.log(`${this.directory}/${this.name}: ${err.message}`);
        return of(void 0);
      })
    );
  }

  private readNameDir$() {
    return defer(() => Filesystem.readdir({
      path: this.name,
      directory: this.directory
    }));
  }

  private readFile$(fileName: string) {
    return defer(() => Filesystem.readFile({
      path: `${this.name}/${fileName}`,
      directory: this.directory,
      encoding: FilesystemEncoding.UTF8
    }));
  }

  getAll$() {
    return this.checkInitialization$().pipe(
      concatMapTo(this.tuples$.asObservable())
    );
  }

  add$(...tuples: T[]) {
    return forkJoinWithDefault(tuples.map(tuple => this.saveFile$(tuple))).pipe(
      concatMapTo(this.checkInitialization$()),
      tap(_ => this.tuples$.next([...this.tuples$.value, ...tuples])),
      mapTo(tuples)
    );
  }

  private saveFile$(tuple: T) {
    // XXX: Use sha256 is not a good idea as `sha256$()` uses `JSON.stringify()` under the hood.
    //      Thus, the order of the tuple (properties) will result in different hash if tuple is
    //      an array (object).
    return sha256$(tuple).pipe(
      concatMap(hash => Filesystem.writeFile({
        path: `${this.name}/${hash}.json`,
        data: JSON.stringify(tuple),
        directory: this.directory,
        encoding: FilesystemEncoding.UTF8,
        recursive: true
      })));
  }

  remove$(...tuples: T[]) {
    return forkJoinWithDefault(tuples.map(tuple => this.deleteFile$(tuple))).pipe(
      concatMapTo(this.refresh$()),
      mapTo(tuples)
    );
  }

  private deleteFile$(tuple: T) {
    // XXX: Use sha256 is not a good idea as `sha256$()` uses `JSON.stringify()` under the hood.
    //      Thus, the order of the tuple (properties) will result in different hash if tuple is
    //      an array (object).
    return sha256$(tuple).pipe(
      concatMap(hash => Filesystem.deleteFile({
        path: `${this.name}/${hash}.json`,
        directory: this.directory
      })));
  }
}
