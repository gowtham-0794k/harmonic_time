import { createAction, props } from '@ngrx/store';

export const loadData = createAction('[User] Load Data');
export const loadDataSuccess = createAction(
  '[user] Load Data Success',
  props<{ data: string[] }>()
);
export const loadDataFailure = createAction(
  '[user] Load Data Failure',
  props<{ error: string }>()
);
