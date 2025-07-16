export interface IProductPayload {
  name: string;
  image?: File | string; 
  visibility?: boolean;
  categoryId: number;
  price: number;
  description: string;
}
export interface IProduct {
  id: number;
  name: string;
  image: string; 
  visibility: boolean;
  price: number;
  description: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string; 
}