import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spin } from './entities/spin.entity';
import { User } from '../users/entities/user.entity';
import { SegmentService } from '../spin-segments/segment.service';
import { ChapaService } from '../chapa-sdk';

@Injectable()
export class SpinTheWheelService {
  constructor(
    @InjectRepository(Spin)
    private spinRepository: Repository<Spin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    private segmentService: SegmentService,
    private readonly chapaService: ChapaService
  ) {}

  async createSpin(userId: string): Promise<Spin> {
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


  async buySpinTickets(userId: string, numberOfTickets: number) {
    const ticketId = 'spin-ticket';
    const ticketRef = `ticket_${ticketId}${Date.now()}`; 

    const initializeOptions = {
      first_name: 'John', 
      last_name: 'Doe', 
      amount: `${numberOfTickets * 10}`,
      currency: 'ETB',
      tx_ref: ticketRef,
      phone_number: '0937108836', 
 
      customization: {
        title: 'Spin Ticket Purchase',
        description: `Purchase ${numberOfTickets} spin tickets`,
      },
   
    };

    try {
      // Initialize payment with Chapa
      const { checkout_url } = await this.chapaService.initialize(initializeOptions);

      return {
        message: 'Please complete your payment by clicking the button below.',
        paymentLink: checkout_url,
      };
    } catch (error) {
      console.error('Error during payment initialization:', error);
      throw new Error('Error initializing payment. Please try again later.');
    }
  }
}
