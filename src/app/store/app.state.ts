export interface AppState {
  // Define your feature states here
  user: UserState;
}

export interface UserState {
  data: string[];
  loading: boolean;
}
