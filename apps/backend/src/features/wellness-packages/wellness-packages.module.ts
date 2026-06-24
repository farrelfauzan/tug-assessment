import { Module } from '@nestjs/common';
import { WellnessPackagesController } from './wellness-packages.controller';
import { WellnessPackagesRepository } from './repositories/wellness-packages.repository';
import { WellnessPackagesService } from './services/wellness-packages.service';

@Module({
  controllers: [WellnessPackagesController],
  providers: [WellnessPackagesService, WellnessPackagesRepository],
  exports: [WellnessPackagesService]
})
export class WellnessPackagesModule {}
