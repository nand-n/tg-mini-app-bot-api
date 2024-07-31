import { Module } from '@nestjs/common';
import { RandomNumberScene } from './scene/random-numbers.scene';
import { GreeterUpdate } from './lorryApp.update';
import { GreeterWizard } from './wizard/greeter.wizard';

@Module({
  providers: [GreeterUpdate, RandomNumberScene, GreeterWizard],
})
export class GreeterModule {}