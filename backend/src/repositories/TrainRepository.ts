import { JSONDatabase } from '../database/db';
import { Train, ScheduleStop, Coach, Seat } from '../domain/types';

export class TrainRepository {
  private db: JSONDatabase;

  constructor() {
    this.db = JSONDatabase.getInstance();
  }

  public findAll(): Train[] {
    return this.db.getData().trains;
  }

  public findById(id: string): Train | undefined {
    return this.db.getData().trains.find((t) => t.id === id || t.number === id);
  }

  public findByNumber(number: string): Train | undefined {
    return this.db.getData().trains.find((t) => t.number === number);
  }

  public searchBetweenStations(sourceCode: string, destCode: string): Train[] {
    const src = sourceCode.toUpperCase();
    const dst = destCode.toUpperCase();

    // Match trains directly or matching schedule stops order
    return this.db.getData().trains.filter((train) => {
      const stops = this.getSchedulesForTrain(train.id);
      const srcStop = stops.find((s) => s.stationCode.toUpperCase() === src);
      const dstStop = stops.find((s) => s.stationCode.toUpperCase() === dst);

      if (srcStop && dstStop && srcStop.stationOrder < dstStop.stationOrder) {
        return true;
      }
      return (
        (train.sourceCode.toUpperCase() === src && train.destinationCode.toUpperCase() === dst) ||
        (train.sourceCode.toUpperCase().includes(src) && train.destinationCode.toUpperCase().includes(dst))
      );
    });
  }

  public getSchedulesForTrain(trainId: string): ScheduleStop[] {
    return this.db
      .getData()
      .schedules.filter((s) => s.trainId === trainId)
      .sort((a, b) => a.stationOrder - b.stationOrder);
  }

  public getCoachesForTrain(trainId: string): Coach[] {
    return this.db.getData().coaches.filter((c) => c.trainId === trainId);
  }

  public getSeatsForCoach(coachId: string): Seat[] {
    return this.db.getData().seats.filter((s) => s.coachId === coachId);
  }

  public getSeatsForTrain(trainId: string): Seat[] {
    return this.db.getData().seats.filter((s) => s.trainId === trainId);
  }

  public create(train: Train): Train {
    this.db.getData().trains.push(train);
    this.db.save();
    return train;
  }

  public update(id: string, updates: Partial<Train>): Train | undefined {
    const train = this.findById(id);
    if (!train) return undefined;

    Object.assign(train, updates);
    this.db.save();
    return train;
  }

  public delete(id: string): boolean {
    const index = this.db.getData().trains.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.db.getData().trains.splice(index, 1);
    this.db.save();
    return true;
  }
}
