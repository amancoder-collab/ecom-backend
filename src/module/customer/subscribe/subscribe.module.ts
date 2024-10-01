import { Module } from '@nestjs/common';
import { Operation } from 'src/common/operations/operation.function';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';

@Module({
  controllers: [SubscribeController],
  providers: [SubscribeService, Operation],
})
export class SubscribeModule {}
