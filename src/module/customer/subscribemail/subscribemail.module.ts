import { Module } from '@nestjs/common';
import { SubscribemailController } from './subscribemail.controller';
import { SubscribemailService } from './subscribemail.service';
import { Operation } from 'src/common/operations/operation.function';

@Module({
    controllers: [SubscribemailController],
    providers: [SubscribemailService, Operation],
})
export class SubscribemailModule {}
