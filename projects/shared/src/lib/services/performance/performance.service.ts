import {inject, Injectable} from '@angular/core';
import {trace, Performance} from '@angular/fire/performance';
import {GenericFunction, GenericPromiseFunction} from '@shared-library/types';

@Injectable({providedIn: 'root'})
export class PerformanceService {
  private performance = inject(Performance);

  async customCodeTrace<FunctionReturnType>(
      traceName: string,
      fn: GenericFunction<unknown, FunctionReturnType> |
          GenericPromiseFunction<unknown, FunctionReturnType>,
  ): Promise<FunctionReturnType> {
    return new Promise((resolve, reject) => {
      try {
        const t = trace(this.performance, traceName);

        t.start();

        if (this._isAsyncFunction(fn)) {
          (fn as GenericPromiseFunction<unknown, FunctionReturnType>)()
              .then((result: FunctionReturnType) => {
                t.stop();

                resolve(result);
              });
        }

        const result = (fn as GenericFunction<unknown, FunctionReturnType>)();

        t.stop();

        resolve(result);
      } catch (error: unknown) {
        console.error('testCodeTrace error', error);

        reject(error);
      }
    });
  }

  private _isAsyncFunction(fn: GenericFunction | GenericPromiseFunction) {
    return fn.constructor.name === 'AsyncFunction';
  }
}
