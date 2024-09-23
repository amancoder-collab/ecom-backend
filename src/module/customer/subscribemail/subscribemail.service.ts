import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { SubEmailDto } from './dto/submail.dto';
import { ClientLogError } from 'src/common/helper/error_description';
import { Operation } from 'src/common/operations/operation.function';
import { ListOrder } from 'src/common/enums/utiles.enum';

@Injectable()
export class SubscribemailService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly operation: Operation,
    ) {}

    async subscribe(dto: SubEmailDto) {
        try {
            return await this.prismaService.subscribeemail.upsert({
                where: { email: dto.email },
                update: { email: dto.email },
                create: { email: dto.email },
            });
        } catch {
            throw new BadRequestException(ClientLogError.SOMETHING_WRONG);
        }
    }
    async list(page: number, limit: number, type: ListOrder, sellerId: string) {
        let seller = await this.prismaService.user.findFirst({
            where: {
                id: sellerId,
            },
        });
        if (!seller) {
            throw new NotFoundException(ClientLogError.ONLY_SELLER);
        }

        const { skip, take } = this.operation.calculatePagination(
            page,
            limit,
        );
        const result = await this.prismaService.subscribeemail.findMany({
            skip,
            take,
            orderBy: {
                created_at: type,
            },
        });
        return result;
    }

    async remove(id: string, sellerId: string) {
        let seller = await this.prismaService.user.findFirst({
            where: {
                id: sellerId,
            },
        });
        if (!seller) {
            throw new NotFoundException(ClientLogError.ONLY_SELLER);
        }

        return await this.prismaService.subscribeemail.delete({
            where: { id },
        });
    }
}
