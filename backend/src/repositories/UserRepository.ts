import { JSONDatabase } from '../database/db';
import { User } from '../domain/types';

export class UserRepository {
  private db: JSONDatabase;

  constructor() {
    this.db = JSONDatabase.getInstance();
  }

  public findById(id: string): User | undefined {
    return this.db.getData().users.find((u) => u.id === id);
  }

  public findByEmail(email: string): User | undefined {
    return this.db.getData().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public create(user: User): User {
    this.db.getData().users.push(user);
    this.db.save();
    return user;
  }

  public update(id: string, updates: Partial<User>): User | undefined {
    const user = this.findById(id);
    if (!user) return undefined;

    Object.assign(user, updates);
    this.db.save();
    return user;
  }
}
