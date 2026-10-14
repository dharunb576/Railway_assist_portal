import { TravelClass } from '../../config/constants';

/**
 * Strategy Pattern (GoF - Behavioral)
 * Strategy interface for calculating fares based on travel class, distance, and base rate.
 */
export interface FareStrategy {
  calculateBaseFare(distanceKm: number): number;
  getReservationCharge(): number;
  getGSTPercentage(): number;
}

export class SleeperFareStrategy implements FareStrategy {
  calculateBaseFare(distanceKm: number): number {
    // ₹0.85 per km
    return Math.round(distanceKm * 0.85);
  }
  getReservationCharge(): number { return 20; }
  getGSTPercentage(): number { return 0; } // No GST on Sleeper
}

export class SecondSeatingFareStrategy implements FareStrategy {
  calculateBaseFare(distanceKm: number): number {
    // ₹0.50 per km
    return Math.round(distanceKm * 0.50);
  }
  getReservationCharge(): number { return 15; }
  getGSTPercentage(): number { return 0; }
}

export class ChairCarFareStrategy implements FareStrategy {
  calculateBaseFare(distanceKm: number): number {
    // ₹1.40 per km
    return Math.round(distanceKm * 1.40);
  }
  getReservationCharge(): number { return 40; }
  getGSTPercentage(): number { return 0.05; } // 5% GST
}

export class AC3TierFareStrategy implements FareStrategy {
  calculateBaseFare(distanceKm: number): number {
    // ₹1.80 per km
    return Math.round(distanceKm * 1.80);
  }
  getReservationCharge(): number { return 40; }
  getGSTPercentage(): number { return 0.05; }
}

export class AC2TierFareStrategy implements FareStrategy {
  calculateBaseFare(distanceKm: number): number {
    // ₹2.40 per km
    return Math.round(distanceKm * 2.40);
  }
  getReservationCharge(): number { return 50; }
  getGSTPercentage(): number { return 0.05; }
}

export class AC1TierFareStrategy implements FareStrategy {
  calculateBaseFare(distanceKm: number): number {
    // ₹3.50 per km
    return Math.round(distanceKm * 3.50);
  }
  getReservationCharge(): number { return 60; }
  getGSTPercentage(): number { return 0.05; }
}

/**
 * Factory Pattern (GoF - Creational)
 * Instantiates the appropriate FareStrategy implementation based on travel class.
 */
export class FareStrategyFactory {
  public static getStrategy(travelClass: TravelClass): FareStrategy {
    switch (travelClass) {
      case TravelClass.FIRST_AC:
        return new AC1TierFareStrategy();
      case TravelClass.SECOND_AC:
        return new AC2TierFareStrategy();
      case TravelClass.THIRD_AC:
        return new AC3TierFareStrategy();
      case TravelClass.SLEEPER:
        return new SleeperFareStrategy();
      case TravelClass.CHAIR_CAR:
        return new ChairCarFareStrategy();
      case TravelClass.SECOND_SEATING:
        return new SecondSeatingFareStrategy();
      default:
        return new SleeperFareStrategy();
    }
  }
}
