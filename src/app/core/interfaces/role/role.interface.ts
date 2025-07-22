export interface IRole {
  id: number;
  name: string;
  active: boolean;
}

export interface IRolePayload {
  name: string;
}

export interface IUserRole {
  role: IRole;
}
