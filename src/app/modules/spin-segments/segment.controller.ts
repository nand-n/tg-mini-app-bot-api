import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { Segment } from './entities/segment.entity';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { SegmentService } from './segment.service';


@Controller('segments')
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Get()
  async findAll(): Promise<Segment[]> {
    return this.segmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Segment> {
    return this.segmentService.findOne(id);
  }

  @Post()
  async create(@Body() createSegmentDto: CreateSegmentDto[]): Promise<Segment[]> {
    return this.segmentService.create(createSegmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.segmentService.remove(id);
  }
}
