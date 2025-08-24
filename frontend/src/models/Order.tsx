export interface Order {
  customer_id?: string;
  redes: boolean;
  cantidad: number;
  modelo: string;
  precio: number;
  pedido: string;
  senia: number;
  producto_base64: File | string | null;
  color?: string;
}
