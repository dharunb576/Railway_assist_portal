import { TravelClass } from '../config/constants';
import { FareStrategyFactory } from '../domain/strategies/FareStrategy';

export interface FareBreakdown {
  travelClass: TravelClass;
  distanceKm: number;
  passengerCount: number;
  baseFarePerPassenger: number;
  reservationChargePerPassenger: number;
  gstPerPassenger: number;
  farePerPassenger: number;
  totalBaseFare: number;
  totalReservationCharge: number;
  totalGst: number;
  grandTotal: number;
}

/**
 * Information Expert & Controller Service (GRASP Principle)
 * Delegates to FareStrategyFactory to compute transparent fare components.
 */
export class FareCalculatorService {
  public calculateFare(distanceKm: number, travelClass: TravelClass, passengerCount: number = 1): FareBreakdown {
    const strategy = FareStrategyFactory.getStrategy(travelClass);
    
    const baseFarePerPax = strategy.calculateBaseFare(distanceKm);
    const resChargePerPax = strategy.getReservationCharge();
    const gstRate = strategy.getGSTPercentage();
    
    const gstPerPax = Math.round((baseFarePerPax + resChargePerPax) * gstRate);
    const farePerPax = baseFarePerPax + resChargePerPax + gstPerPax;

    const totalBaseFare = baseFarePerPax * passengerCount;
    const totalReservationCharge = resChargePerPax * passengerCount;
    const totalGst = gstPerPax * passengerCount;
    const grandTotal = farePerPax * passengerCount;

    return {
      travelClass,
      distanceKm,
      passengerCount,
      baseFarePerPassenger: baseFarePerPax,
      reservationChargePerPassenger: resChargePerPax,
      gstPerPassenger: gstPerPax,
      farePerPassenger: farePerPax,
      totalBaseFare,
      totalReservationCharge,
      totalGst,
      grandTotal
    };
  }
}
