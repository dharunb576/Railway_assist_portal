import { BerthType, SeatStatus, TravelClass } from '../../config/constants';
import { Seat } from '../types';

/**
 * Factory Pattern (GoF - Creational)
 * Generates seat instances with appropriate berth types based on travel class and coach layout rules.
 */
export class SeatFactory {
  public static createSeatsForCoach(coachId: string, trainId: string, classType: TravelClass, totalSeats: number = 24): Seat[] {
    const seats: Seat[] = [];

    for (let seatNum = 1; seatNum <= totalSeats; seatNum++) {
      let berth: BerthType = BerthType.LOWER;

      if (classType === TravelClass.CHAIR_CAR || classType === TravelClass.SECOND_SEATING) {
        berth = seatNum % 2 === 1 ? BerthType.WINDOW : BerthType.AISLE;
      } else {
        // Sleeper or AC 3Tier layout (8 seat module cycle: Lower, Middle, Upper, Lower, Middle, Upper, Side Lower, Side Upper)
        const modulo = seatNum % 8;
        switch (modulo) {
          case 1: case 4: berth = BerthType.LOWER; break;
          case 2: case 5: berth = BerthType.MIDDLE; break;
          case 3: case 6: berth = BerthType.UPPER; break;
          case 7: berth = BerthType.SIDE_LOWER; break;
          case 0: berth = BerthType.SIDE_UPPER; break;
        }
      }

      // Pre-book some demo seats (e.g. seats 3, 7, 12, 18) for realistic simulation
      let status: SeatStatus = SeatStatus.AVAILABLE;
      if ([3, 7, 12, 18].includes(seatNum)) {
        status = SeatStatus.BOOKED;
      } else if (seatNum === 1 || seatNum === 2) {
        status = SeatStatus.LADIES;
      }

      seats.push({
        id: `seat_${coachId}_${seatNum}`,
        coachId,
        trainId,
        seatNumber: seatNum,
        berthType: berth,
        status
      });
    }

    return seats;
  }
}
