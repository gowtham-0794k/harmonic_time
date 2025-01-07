import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import {
  loadData,
  loadDataSuccess,
  loadDataFailure,
} from '../actions/user.actions';
import { GenericService } from 'src/app/shared/services/generic.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private genericServices: GenericService
  ) {}

  loadData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadData),
      mergeMap(() =>
        this.genericServices.getData().pipe(
          map((data: any) => loadDataSuccess({ data })),
          catchError((error) => of(loadDataFailure({ error })))
        )
      )
    )
  );
}
