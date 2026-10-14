import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { JWT_SECRET, UserRole } from '../config/constants';
import { User } from '../domain/types';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  public register(name: string, email: string, password: string, phone: string, role: UserRole = UserRole.USER): { user: Omit<User, 'passwordHash'>; token: string } {
    const existing = this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const id = `usr_${Date.now()}`;
    const newUser: User = {
      id,
      name,
      email,
      passwordHash,
      role,
      phone: phone || '9876543210',
      createdAt: new Date().toISOString()
    };

    this.userRepo.create(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return { user: userWithoutPassword, token };
  }

  public login(email: string, password: string): { user: Omit<User, 'passwordHash'>; token: string } {
    const user = this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}
