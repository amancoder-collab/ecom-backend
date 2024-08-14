import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Operation } from 'src/common/operations/operation.function';

@Module({
    controllers: [ReviewController],
    providers: [ReviewService, Operation],
})
export class ReviewModule {}
