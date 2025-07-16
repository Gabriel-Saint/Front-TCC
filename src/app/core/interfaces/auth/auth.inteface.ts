
export interface IAuthSignUp {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
}

export interface IAuthSignIn {
  email: string;
  password: string;
}

export interface IAuthResponse {
    token: string; 
}