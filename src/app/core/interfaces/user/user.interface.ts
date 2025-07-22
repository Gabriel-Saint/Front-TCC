import { IUserRole } from "../role/role.interface";

export interface IUser {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  userRoles?: IUserRole[]
}

export interface IUserUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
  cpf?: string;
  phone?: string;
}