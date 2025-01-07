import { createReducer, on } from '@ngrx/store';
import {
  registerUser,
  registerUserSuccess,
  registerUserFailure,
} from '../actions/user.actions';

export interface UserState {
  data: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  data: [],
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(registerUser, (state) => ({ ...state, loading: true })),
  on(registerUserSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
  })),
  on(registerUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
