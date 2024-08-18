import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spin } from './entities/spin.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SpinTheWheelService {
  constructor(
    @InjectRepository(Spin)
    private spinRepository: Repository<Spin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createSpin(userId: string, result: string): Promise<Spin> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const spin = this.spinRepository.create({ result, user });
    return this.spinRepository.save(spin);
  }

  getUserSpins(userId: string): Promise<Spin[]> {
    return this.spinRepository.find({ where: { user: { id: userId } } });
  }

  getAllSpins(): Promise<Spin[]> {
    return this.spinRepository.find({ relations: ['user'] });
  }
}
