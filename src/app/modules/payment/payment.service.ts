import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateEqubPaymentDto } from './dto/create-equb.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const newPayment = this.paymentRepository.create(createPaymentDto);
    return await this.paymentRepository.save(newPayment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({where:{id}});
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const existingPayment = await this.findOne(id);
    const updatedPayment = Object.assign(existingPayment, updatePaymentDto);
    return await this.paymentRepository.save(updatedPayment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.remove(payment);
  }

  async createEqubPayment(createEqubPaymentDto: CreateEqubPaymentDto): Promise<Payment> {
    const newEqubPayment = this.paymentRepository.create(createEqubPaymentDto);
    return await this.paymentRepository.save(newEqubPayment);
  }
}
