import { createReducer, on } from '@ngrx/store';
import {
  loadData,
  loadDataSuccess,
  loadDataFailure,
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
  on(loadData, (state) => ({ ...state, loading: true })),
  on(loadDataSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
  })),
  on(loadDataFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
