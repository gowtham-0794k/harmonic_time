import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  registerUser,
  registerUserSuccess,
  registerUserFailure,
  loginUserSuccess,
  loginUserFailure,
  loginUser,
  loadUser,
  loadUserSuccess,
  loadUserFailure,
} from '../actions/user.actions';
import { GenericService } from 'src/app/shared/services/generic.service';
import { UserService } from '@shared/services/user.service';
import { loadCart } from '../actions/cart.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private genericService: GenericService,
    public userService: UserService
  ) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap((action) =>
        this.genericService.postObservable(action.url, action.payload).pipe(
          map((result: any) => {
            return registerUserSuccess({ data: result });
          }),
          catchError((err) => {
            return of(registerUserFailure({ error: err }));
          })
        )
      )
    )
  );

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      mergeMap((action) =>
        this.genericService.postObservable(action.url, action.payload).pipe(
          map((result: any) => {
            return loginUserSuccess({ data: result });
          }),
          catchError((err) => {
            return of(loginUserFailure({ error: err }));
          })
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUser),
      switchMap(() =>
        this.userService.getUserData().pipe(
          map((user) => loadUserSuccess({ user })),
          catchError((error) => of(loadUserFailure({ error })))
        )
      )
    )
  );

  loadUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserSuccess),
      map(() => loadCart()) // Dispatch loadCart only after user loads
    )
  );
}
