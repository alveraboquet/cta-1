import { AgentExecutionResult, AgentGridConfig } from '@cta/shared/dtos';
import { OrderSide } from '@cta/shared/dtos';

export interface GridLine {
  active: boolean;
  price: number;
  side: OrderSide;
}

export class GridBot {
  private MAX_QUOTE_ASSET_AMOUNT = 100;
  private gridLines = [] as GridLine[];

  constructor(public config: AgentGridConfig) {}

  private initGridLines(lastPrice: number) {
    let closestPriceIdx = 0;

    for (let i = 0; i <= this.config.gridCount; i++) {
      const price = this.config.minPrice + this.config.gridWidth * (i + 1),
        closestPrice = this.gridLines[closestPriceIdx]?.price;

      this.gridLines.push({
        active: true,
        side: OrderSide.BUY,
        price,
      });

      if (closestPrice !== undefined && Math.abs(lastPrice - price) < Math.abs(lastPrice - closestPrice)) {
        closestPriceIdx = i;
      }
    }

    this.updateGridLines(closestPriceIdx);
  }

  private updateGridLines(index: number) {
    this.gridLines[index].active = false;

    for (let i = 0, il = this.gridLines.length; i < il; ++i) {
      if (i > index) {
        this.gridLines[i].active = true;
        this.gridLines[i].side = OrderSide.SELL;
      } else if (i < index) {
        this.gridLines[i].active = true;
        this.gridLines[i].side = OrderSide.BUY;
      }
    }
  }

  private decideSide(lastPrice: number): OrderSide | undefined {
    // TODO: check if price is below-min/over-high => disable or recalibrate

    // check buy
    for (let i = 0, il = this.gridLines.length; i < il; ++i) {
      const { active, side, price } = this.gridLines[i];

      if (active && side === OrderSide.BUY && lastPrice <= price) {
        this.updateGridLines(i);
        return OrderSide.BUY;
      }
    }

    // check sell
    for (let i = this.gridLines.length - 1; i >= 0; --i) {
      const { active, side, price } = this.gridLines[i];

      if (active && side === OrderSide.SELL && lastPrice >= price) {
        this.updateGridLines(i);
        return OrderSide.SELL;
      }
    }
  }

  public execute(lastPrice: number): AgentExecutionResult {
    if (this.gridLines.length === 0) {
      this.initGridLines(lastPrice);
    }

    return {
      symbol: this.config.pair,
      side: this.decideSide(lastPrice),
      quantity: this.MAX_QUOTE_ASSET_AMOUNT / lastPrice,
      price: lastPrice.toString(),
      type: '',
    };
  }
}
