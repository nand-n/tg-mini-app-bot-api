import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Spin } from './entities/spin.entity';
import { User } from '../users/entities/user.entity';
import { SegmentService } from '../spin-segments/segment.service';
import { ChapaService, InitializeOptions, VerifyOptions, VerifyResponse } from '../chapa-sdk';
import { SpinTicket } from './entities/spin-ticket.entity';

@Injectable()
export class SpinTheWheelService {
  constructor(
    @InjectRepository(Spin)
    private spinRepository: Repository<Spin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SpinTicket)
    private spinTicketRepository: Repository<SpinTicket>,
    
    private segmentService: SegmentService,
    private readonly chapaService: ChapaService,
  
  ) {}

async createSpin(userId: string): Promise<any> {
  try {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const availableTicket = await this.spinTicketRepository.findOne({
      where: { user: { id: user.id }, used: false }, 
    });

    if (!availableTicket) {
      throw new Error('No available spin tickets. Please purchase a ticket.');
    }

    const segments = await this.segmentService.findAll();

    const winningSegmentCounts = await this.spinRepository
      .createQueryBuilder('spin')
      .select('spin.result.id', 'segmentId')  
      .addSelect('COUNT(spin.result)', 'winCount')
      .groupBy('spin.result.id')
      .getRawMany();

    const commonWinningSegmentIds = winningSegmentCounts
      .filter(segment => parseInt(segment.winCount, 10) > 3)
      .map(segment => segment.segmentId);

    const weightedSegments = segments.flatMap(segment => {
      const isCommonWinningSegment = commonWinningSegmentIds.includes(segment.id);
      const weight = isCommonWinningSegment ? 1 : 3;
      return Array(weight).fill(segment);
    });

    const winningSegment = weightedSegments[Math.floor(Math.random() * weightedSegments.length)];

    const spin = this.spinRepository.create({
      user,
      result: winningSegment,
      ticket: availableTicket,
    });

    await this.spinRepository.save(spin);

    availableTicket.used = true;
    await this.spinTicketRepository.save(availableTicket);

    return this.spinRepository.findOne({
      where: { id: spin.id },
      relations: ['result', 'ticket'],
    });

  } catch (error) {
      throw new HttpException(error.message || 'Internal server error', HttpStatus.FORBIDDEN);
  }
  
}


async buySpinTickets(numberOfTickets: number) {
  const ticketId = 'spin-ticket';
  const ticketRef = `ticket_${ticketId}${Date.now()}`;

  const initializeOptions:InitializeOptions = {
    first_name: 'John',
    last_name: 'Doe',
    amount: `${numberOfTickets * 10}`,
    currency: 'ETB',
    tx_ref: ticketRef,
    phone_number: '0937108836',
  };

  try {
    const { checkout_url } = await this.chapaService.initialize(initializeOptions);
    return {
      message: 'Please complete your payment by clicking the button below.',
      paymentLink: checkout_url,
      ticketRef
    };
  } catch (error) {
    console.error('Error during payment initialization:', error);
    throw new HttpException('Error initializing payment. Please try again later.', HttpStatus.FORBIDDEN);
  }
}

async verifyAndIssueTickets(userId: string, txRef: string): Promise<SpinTicket[]> {
  const verifyOptions: VerifyOptions = { tx_ref: txRef };

  try {
    const verificationResponse:VerifyResponse = await this.chapaService.verify(verifyOptions);

    if (verificationResponse.data.status === 'success') {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const numberOfTickets = parseInt(verificationResponse.data.amount) / 10;

      const tickets: SpinTicket[] = [];

      for (let i = 0; i < numberOfTickets; i++) {
        const ticket = this.spinTicketRepository.create({
          user,
          used: false,
        });
        tickets.push(await this.spinTicketRepository.save(ticket));
      }

      return tickets;
    } else {
      throw new BadRequestException('Payment verification failed or payment not successful.');
    }
  } catch (error) {
    console.error('Error during payment verification:', error);
    throw error;
  }
}
}
