export interface AuthUser {
  readonly uid: string;
  readonly email: string | null;
}

export type AuthModalTab = 'login' | 'register';
