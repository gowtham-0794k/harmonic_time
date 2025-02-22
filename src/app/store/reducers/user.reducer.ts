import { createReducer, on } from '@ngrx/store';
import {
  registerUser,
  registerUserSuccess,
  registerUserFailure,
  loginUser,
  loginUserSuccess,
  loginUserFailure,
  loadUserSuccess,
  loadUser,
} from '../actions/user.actions';

export interface UserState {
  data: string[];
  loading: boolean;
  error: string | null;
  user: any;
}

export const initialState: UserState = {
  data: [],
  loading: false,
  error: null,
  user: null,
};

export const userReducer = createReducer(
  initialState,

  // Login Actions
  on(loginUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loginUserSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
    error: null,
  })),
  on(loginUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Register Actions
  on(registerUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(registerUserSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
    error: null,
  })),
  on(registerUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // user data Actions
  on(loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(registerUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
