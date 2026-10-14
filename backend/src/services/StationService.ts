import { StationRepository } from '../repositories/StationRepository';
import { Station } from '../domain/types';

export class StationService {
  private stationRepo: StationRepository;

  constructor() {
    this.stationRepo = new StationRepository();
  }

  public getAllStations(): Station[] {
    return this.stationRepo.findAll();
  }

  public searchStations(query: string): Station[] {
    return this.stationRepo.search(query);
  }

  public createStation(stationData: Partial<Station>): Station {
    if (!stationData.code || !stationData.name) {
      throw new Error('Station code and name are required');
    }
    const id = `stn_${Date.now()}`;
    const station: Station = {
      id,
      code: stationData.code.toUpperCase(),
      name: stationData.name,
      city: stationData.city || stationData.name,
      state: stationData.state || 'India'
    };

    return this.stationRepo.create(station);
  }

  public updateStation(id: string, updates: Partial<Station>): Station | undefined {
    return this.stationRepo.update(id, updates);
  }
}
