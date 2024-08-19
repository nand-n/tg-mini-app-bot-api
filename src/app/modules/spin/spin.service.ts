import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spin } from './entities/spin.entity';
import { User } from '../users/entities/user.entity';
import { Segment } from '../spin-segments/entities/segment.entity';
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

  // async createSpin(userId: string, selectedSegmentId: string): Promise<Spin> {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const selectedSegment = await this.segmentService.findOne(selectedSegmentId);
  //   if (!selectedSegment) {
  //     throw new NotFoundException('Selected segment not found');
  //   }

  //   // Fetch all segments using SegmentService
  //   const segments = await this.segmentService.findAll();

  //   // Implement probability manipulation to ensure system win
  //   const manipulatedSegments = this.manipulateSegmentOdds(segments, selectedSegment);

  //   // Select a winning segment based on the manipulated odds
  //   const winningSegment = this.selectWinningSegment(manipulatedSegments);

  //   // Create the spin record
  //   const spin = this.spinRepository.create({ user, result: winningSegment });
  //   return this.spinRepository.save(spin);
  // }

  // private manipulateSegmentOdds(segments: Segment[], selectedSegment: Segment): Segment[] {
  //   // Manipulate the odds to reduce the chance of the most common winning segments
  //   // Example: Add more entries of less common segments to the pool
  //   const probabilityPool = [];

  //   segments.forEach(segment => {
  //     const isCommonWinningSegment = /* logic to check if this segment has won often */
  //     const entries = isCommonWinningSegment ? 1 : 5; // Fewer entries for common segments, more for rare ones
  //     for (let i = 0; i < entries; i++) {
  //       probabilityPool.push(segment);
  //     }
  //   });

  //   // Increase odds for the selected segment if desired
  //   for (let i = 0; i < 10; i++) {
  //     probabilityPool.push(selectedSegment);
  //   }

  //   return probabilityPool;
  // }

  // private selectWinningSegment(manipulatedSegments: Segment[]): Segment {
  //   const randomIndex = Math.floor(Math.random() * manipulatedSegments.length);
  //   return manipulatedSegments[randomIndex];
  // }

  async createSpin(userId: string, selectedSegmentId: string): Promise<Spin> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const segments = await this.segmentService.findAll();

    // Get frequency of winning segments
    const winningSegmentCounts = await this.spinRepository
      .createQueryBuilder('spin')
      .select('spin.result', 'segmentId')
      .addSelect('COUNT(spin.result)', 'winCount')
      .groupBy('spin.result')
      .getRawMany();

    // Determine common winning segments
    const commonWinningSegmentIds = winningSegmentCounts
      .filter(segment => segment.winCount > 3) // Adjust this threshold based on your requirements
      .map(segment => segment.segmentId);

    // Adjust segment probabilities based on their win frequency
    const weightedSegments = segments.flatMap(segment => {
      const isCommonWinningSegment = commonWinningSegmentIds.includes(segment.id);

      // Reduce the probability of common winning segments
      const weight = isCommonWinningSegment ? 1 : 3; // Adjust the weights based on your needs

      return Array(weight).fill(segment);
    });

    // Randomly select a segment based on the weighted probabilities
    const winningSegment = weightedSegments[Math.floor(Math.random() * weightedSegments.length)];

    const spin = this.spinRepository.create({
      user,
      result: winningSegment.id, // Store the segment ID as the result
    });

    return this.spinRepository.save(spin);
  }
}
