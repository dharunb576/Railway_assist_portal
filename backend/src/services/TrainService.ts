import { TrainRepository } from '../repositories/TrainRepository';
import { StationRepository } from '../repositories/StationRepository';
import { SeatAllocationService } from './SeatAllocationService';
import { FareCalculatorService } from './FareCalculatorService';
import { TravelClass } from '../config/constants';
import { Train } from '../domain/types';

export class TrainService {
  private trainRepo: TrainRepository;
  private stationRepo: StationRepository;
  private seatService: SeatAllocationService;
  private fareCalculator: FareCalculatorService;

  constructor() {
    this.trainRepo = new TrainRepository();
    this.stationRepo = new StationRepository();
    this.seatService = new SeatAllocationService();
    this.fareCalculator = new FareCalculatorService();
  }

  public getAllTrains(): Train[] {
    return this.trainRepo.findAll();
  }

  public getTrainById(id: string): Train | undefined {
    return this.trainRepo.findById(id);
  }

  public getTrainDetailsWithSchedule(id: string) {
    const train = this.trainRepo.findById(id);
    if (!train) return null;

    const schedule = this.trainRepo.getSchedulesForTrain(train.id);
    const coaches = this.trainRepo.getCoachesForTrain(train.id);
    const availability = this.seatService.getClassAvailability(train.id);

    return {
      train,
      schedule,
      coaches,
      availability
    };
  }

  public searchTrains(sourceCode: string, destCode: string, travelClass?: TravelClass) {
    const srcStation = this.stationRepo.findByCode(sourceCode);
    const dstStation = this.stationRepo.findByCode(destCode);

    let trains = this.trainRepo.searchBetweenStations(sourceCode, destCode);

    if (travelClass) {
      trains = trains.filter((t) => t.availableClasses.includes(travelClass));
    }

    return trains.map((trn) => {
      const availability = this.seatService.getClassAvailability(trn.id);

      // Compute sample fare for each class
      const classFares: Record<string, number> = {};
      trn.availableClasses.forEach((cls) => {
        const fareInfo = this.fareCalculator.calculateFare(trn.distanceKm, cls, 1);
        classFares[cls] = fareInfo.grandTotal;
      });

      return {
        ...trn,
        availability,
        classFares,
        minFare: Math.min(...Object.values(classFares))
      };
    });
  }

  public createTrain(trainData: Partial<Train>): Train {
    if (!trainData.number || !trainData.name) {
      throw new Error('Train number and name are required');
    }
    const id = `trn_${trainData.number}`;
    const newTrain: Train = {
      id,
      number: trainData.number,
      name: trainData.name,
      trainType: trainData.trainType || 'Express',
      sourceStationId: trainData.sourceStationId || 'stn_1',
      destinationStationId: trainData.destinationStationId || 'stn_2',
      sourceCode: trainData.sourceCode || 'MAS',
      sourceName: trainData.sourceName || 'Chennai Central',
      destinationCode: trainData.destinationCode || 'SBC',
      destinationName: trainData.destinationName || 'KSR Bengaluru',
      departureTime: trainData.departureTime || '08:00 AM',
      arrivalTime: trainData.arrivalTime || '02:00 PM',
      durationMinutes: trainData.durationMinutes || 360,
      distanceKm: trainData.distanceKm || 350,
      availableClasses: trainData.availableClasses || [TravelClass.SLEEPER, TravelClass.THIRD_AC],
      totalCoaches: trainData.totalCoaches || 4
    };

    return this.trainRepo.create(newTrain);
  }

  public updateTrain(id: string, updates: Partial<Train>): Train | undefined {
    return this.trainRepo.update(id, updates);
  }

  public deleteTrain(id: string): boolean {
    return this.trainRepo.delete(id);
  }
}
