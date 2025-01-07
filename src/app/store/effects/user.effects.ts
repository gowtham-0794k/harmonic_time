import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  registerUser,
  registerUserSuccess,
  registerUserFailure,
} from '../actions/user.actions';
import { GenericService } from 'src/app/shared/services/generic.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private genericService: GenericService
  ) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap((action) =>
        this.genericService.postObservable(action.url, action.payload).pipe(
          map((result: any) => {
            console.log({ result });
            return registerUserSuccess({ data: result });
          }),
          catchError((err) => {
            console.error({ err });
            return of(registerUserFailure({ error: err }));
          })
        )
      )
    )
  );
}
