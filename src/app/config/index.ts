import { environment } from '@environment';
const env_auth = environment.apiUrl;

export const REGISTER_USER = env_auth + '/api/users/register';
