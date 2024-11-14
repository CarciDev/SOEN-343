import type { PricingStrategy } from "./PricingStrategy";
import { DefaultPricingStrategy } from "./DefaultPricingStrategy";
import { OversizedOverweightPricingStrategy } from "./OversizedOverweightPricingStrategy";
import { InternationalPricingStrategy } from "./InternationalPricingStrategy";

export class PricingContext {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy = new DefaultPricingStrategy()) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  calculatePrice(
    originCoords: { lat: number; lng: number },
    destCoords: { lat: number; lng: number },
    dimensions: {
      depth: number;
      width: number;
      height: number;
      weight: number;
    },
    originCountryCode: string,
    destinationCountryCode: string,
  ): Promise<number> {
    // Select strategy based on package details
    const volumeThreshold = 100000; // 1m^3
    const weightThreshold = 30000; // 30kg
    if (originCountryCode !== destinationCountryCode) {
      this.strategy = new InternationalPricingStrategy();
    } else if (
      dimensions.depth * dimensions.width * dimensions.height >
        volumeThreshold ||
      dimensions.weight > weightThreshold
    ) {
      this.strategy = new OversizedOverweightPricingStrategy();
    } else {
      this.strategy = new DefaultPricingStrategy();
    }

    return this.strategy.calculatePrice(
      originCoords,
      destCoords,
      dimensions,
      originCountryCode,
      destinationCountryCode,
    );
  }
}
