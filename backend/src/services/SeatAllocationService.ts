import { TrainRepository } from '../repositories/TrainRepository';
import { TravelClass, SeatStatus } from '../config/constants';
import { Seat, Coach } from '../domain/types';

export interface ClassAvailability {
  travelClass: TravelClass;
  coachCode: string;
  totalSeats: number;
  availableSeats: number;
  status: 'AVAILABLE' | 'RAC' | 'WAITLIST';
}

/**
 * SeatAllocationService (Pure Fabrication & High Cohesion - GRASP)
 * Manages seat layout mapping, seat selection validation, and coach seat availability lookup.
 */
export class SeatAllocationService {
  private trainRepo: TrainRepository;

  constructor() {
    this.trainRepo = new TrainRepository();
  }

  public getCoachSeats(trainId: string, travelClass: TravelClass): { coach: Coach; seats: Seat[] } | null {
    const train = this.trainRepo.findById(trainId);
    if (!train) return null;

    const coaches = this.trainRepo.getCoachesForTrain(train.id);
    const targetCoach = coaches.find((c) => c.classType === travelClass);
    if (!targetCoach) return null;

    const seats = this.trainRepo.getSeatsForCoach(targetCoach.id);
    return { coach: targetCoach, seats };
  }

  public getClassAvailability(trainId: string): ClassAvailability[] {
    const train = this.trainRepo.findById(trainId);
    if (!train) return [];

    const coaches = this.trainRepo.getCoachesForTrain(train.id);
    const result: ClassAvailability[] = [];

    coaches.forEach((coach) => {
      const seats = this.trainRepo.getSeatsForCoach(coach.id);
      const availCount = seats.filter((s) => s.status === SeatStatus.AVAILABLE).length;

      result.push({
        travelClass: coach.classType,
        coachCode: coach.coachCode,
        totalSeats: coach.totalSeats,
        availableSeats: availCount,
        status: availCount > 0 ? 'AVAILABLE' : 'WAITLIST'
      });
    });

    return result;
  }
}
