
export interface IUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  
}

export interface IUserUpdatePayload {
  name?: string;
  email?: string;
  password?: string; // Incluído caso a atualização de senha seja permitida
  cpf?: string;
  phone?: string;
}