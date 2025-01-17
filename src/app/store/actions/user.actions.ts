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

export const loginUser = createAction(
  '[User] Login',
  props<{ url: string; payload: { email: string; password: number } }>()
);
export const loginUserSuccess = createAction(
  '[User] Login Success',
  props<{ data: string[] | any }>()
);
export const loginUserFailure = createAction(
  '[User] Login Failure',
  props<{ error: string }>()
);
