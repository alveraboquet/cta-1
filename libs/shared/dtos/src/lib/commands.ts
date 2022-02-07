export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

export interface OrderCommand {
  symbol: string;
  side: OrderSide;
  type: string;
  price: string;
  quantity: number;
}
