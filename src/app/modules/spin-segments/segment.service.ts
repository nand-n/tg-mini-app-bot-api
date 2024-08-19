import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from './entities/segment.entity';
import { CreateSegmentDto } from './dto/create-segment.dto';

@Injectable()
export class SegmentService {
  constructor(
    @InjectRepository(Segment)
    private readonly segmentRepository: Repository<Segment>,
  ) {}

  async findAll(): Promise<Segment[]> {
    return this.segmentRepository.find();
  }

  async findOne(id: string): Promise<Segment> {
    const segment = await this.segmentRepository.findOne({ where: { id } });
    if (!segment) {
      throw new NotFoundException(`Segment with ID ${id} not found`);
    }
    return segment;
  }

  async create(createSegmentDto: CreateSegmentDto[]): Promise<Segment[]> {
    const segment = this.segmentRepository.create(createSegmentDto);
    return this.segmentRepository.save(segment);
  }
  async remove(id: string): Promise<void> {
    const result = await this.segmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Segment with ID ${id} not found`);
    }
  }

  async selectSegment(): Promise<Segment> {
    const segments = await this.segmentRepository.find();

    const totalSelections = segments.reduce(
      (sum, segment) => sum + (1 / (segment.selectionCount + 1)),
      0,
    );

    const weightedSegments = segments.map((segment) => ({
      segment,
      weight: (1 / (segment.selectionCount + 1)) / totalSelections,
    }));

    const random = Math.random();
    let cumulativeWeight = 0;

    for (const weightedSegment of weightedSegments) {
      cumulativeWeight += weightedSegment.weight;
      if (random <= cumulativeWeight) {
        return weightedSegment.segment;
      }
    }

    return segments[0];
  }

  async updateSegmentSelection(segment: Segment): Promise<Segment> {
    segment.selectionCount += 1;
    return this.segmentRepository.save(segment);
  }
}
