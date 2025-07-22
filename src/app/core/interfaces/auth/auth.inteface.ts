
export interface IAuthSignUp {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  roleIds?: number[];
}

export interface IAuthSignIn {
  email: string;
  password: string;
}

export interface IAuthResponse {
    token: string; 
}