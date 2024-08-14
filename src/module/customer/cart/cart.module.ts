import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Operation } from 'src/common/operations/operation.function';

@Module({
    controllers: [CartController],
    providers: [CartService, Operation],
})
export class CartModule {}
