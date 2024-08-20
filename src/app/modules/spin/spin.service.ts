import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spin } from './entities/spin.entity';
import { User } from '../users/entities/user.entity';
import { SegmentService } from '../spin-segments/segment.service';

@Injectable()
export class SpinTheWheelService {
  constructor(
    @InjectRepository(Spin)
    private spinRepository: Repository<Spin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    private segmentService: SegmentService,
  ) {}
  async createSpin(userId: string, selectedSegmentId: string): Promise<Spin> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const segments = await this.segmentService.findAll();
    const winningSegmentCounts = await this.spinRepository
      .createQueryBuilder('spin')
      .select('spin.result', 'segmentId')
      .addSelect('COUNT(spin.result)', 'winCount')
      .groupBy('spin.result')
      .getRawMany();

    const commonWinningSegmentIds = winningSegmentCounts
      .filter(segment => segment.winCount > 3) 
      .map(segment => segment.segmentId);

    const weightedSegments = segments.flatMap(segment => {
      const isCommonWinningSegment = commonWinningSegmentIds.includes(segment.id);

      const weight = isCommonWinningSegment ? 1 : 3;

      return Array(weight).fill(segment);
    });

    const winningSegment = weightedSegments[Math.floor(Math.random() * weightedSegments.length)];

    const spin = this.spinRepository.create({
      user,
      result: winningSegment.id, 
    });

    await this.spinRepository.save(spin);

    return this.spinRepository.findOne({
      where: { id: spin.id },
      relations: ['result'],
    });
  }
}
