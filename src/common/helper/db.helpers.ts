import { Injectable } from '@nestjs/common';
import exp from 'constants';
import { PrismaService } from 'src/module/prisma/prisma.service';

class UpdateUserDto {
    name: string;
}
@Injectable()
export class DbHelper {
    constructor(private readonly prismaService: PrismaService) {}

    async findUserByEmail(email: string) {
        return this.prismaService.user.findUnique({
            where: { email, is_deleted: false },
        });
    }

    async findUserById(id: string) {
        return this.prismaService.user.findUnique({
            where: { id, is_deleted: false },
        });
    }

    async updateUser(id: string, data: Partial<UpdateUserDto>) {
        return this.prismaService.user.update({
            where: { id },
            data,
        });
    }
}
