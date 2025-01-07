import { createAction, props } from '@ngrx/store';

export const registerUser = createAction(
  '[User] Register',
  props<{ url: string; payload: { email: string; password: number } }>()
);
export const registerUserSuccess = createAction(
  '[User] Register Success',
  props<{ data: string[] }>()
);
export const registerUserFailure = createAction(
  '[User] Register Failure',
  props<{ error: string }>()
);
