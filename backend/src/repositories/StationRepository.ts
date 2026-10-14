import { JSONDatabase } from '../database/db';
import { Station } from '../domain/types';

export class StationRepository {
  private db: JSONDatabase;

  constructor() {
    this.db = JSONDatabase.getInstance();
  }

  public findAll(): Station[] {
    return this.db.getData().stations;
  }

  public findById(id: string): Station | undefined {
    return this.db.getData().stations.find((s) => s.id === id);
  }

  public findByCode(code: string): Station | undefined {
    return this.db.getData().stations.find((s) => s.code.toUpperCase() === code.toUpperCase());
  }

  public search(query: string): Station[] {
    const q = query.toLowerCase();
    return this.db.getData().stations.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    );
  }

  public create(station: Station): Station {
    this.db.getData().stations.push(station);
    this.db.save();
    return station;
  }

  public update(id: string, updates: Partial<Station>): Station | undefined {
    const station = this.findById(id);
    if (!station) return undefined;

    Object.assign(station, updates);
    this.db.save();
    return station;
  }
}
