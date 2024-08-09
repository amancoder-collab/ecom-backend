import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';
import { JwtHelper } from 'src/common/helper/jwt.helper';
import { HashHelper } from 'src/common/helper/hash.helper';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { DbHelper } from 'src/common/helper/db.helpers';

@Injectable()
export class AuthService {
    private dbHelper: DbHelper;
    private hashHelper: HashHelper;
    private jwtHelper: JwtHelper;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {
        this.dbHelper = new DbHelper(prismaService);
        this.hashHelper = new HashHelper();
        this.jwtHelper = new JwtHelper(jwtService);
    }

    async signup(dto: SignupDto) {
        const existingUser = await this.prismaService.user.findFirst({
            where: { email: dto.email },
        });

        if (existingUser && existingUser.is_deleted) {
            await this.prismaService.user.delete({
                where: { id: existingUser.id },
            });
        }

        const newUser = await this.prismaService.user.findFirst({
            where: { email: dto.email },
        });

        if (newUser) {
            throw new BadRequestException('Email is already registered.');
        }

        const createUser = await this.createNewUser(dto);

        const accessToken = await this.generateAccessToken(createUser.id);

        return {
            message: 'Sign up successfully!',
            user_id: createUser.id,
            access_token: accessToken.accessToken,
            refresh_token: accessToken.refreshToken,
        };
    }

    async deletedUser(id: string) {
        return await this.prismaService.user.delete({
            where: { id: id },
        });
    }

    async login(dto: loginDto) {
        const foundUser = await this.dbHelper.findUserByEmail(dto.email);

        if (
            !foundUser ||
            !(await this.hashHelper.comparePassword(
                dto.password,
                foundUser.password,
            ))
        ) {
            throw new BadRequestException('Invalid email or password');
        }

        const accessToken = await this.generateAccessToken(foundUser.id);

        const result = {
            user_id: foundUser.id,
            access_token: accessToken.accessToken,
            refresh_token: accessToken.refreshToken,
            message: 'Login successful!',
        };
        return result;
    }

    async generateAccessToken(id: string) {
        const findUser = await this.prismaService.user.findUnique({
            where: { id, is_deleted: false },
        });
        if (!findUser) {
            throw new NotFoundException('user is not found');
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: id,
                    email: findUser.email,
                },
                {
                    expiresIn: Number(process.env.ACCESS_TOKEN_SECRET_EXPIRE),
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: id,
                },
                {
                    expiresIn: Number(process.env.REFRESH_TOKEN_SECRET_EXPIRE),
                },
            ),
        ]);
        const token = await this.hashHelper.hash(refreshToken);
        await this.prismaService.user
            .update({
                where: {
                    id: id,
                },
                data: {
                    refresh_token: token,
                },
            })
            .catch((err) => {
                console.log(err);
                throw new BadRequestException('Something went wrong');
            });
        return {
            accessToken,
            refreshToken,
        };
    }

    async findOne(id: string) {
        return await this.prismaService.user.findUnique({
            where: { id, is_deleted: false },
        });
    }
    async refreshToken(refreshToken: string) {
        try {
            if (refreshToken === null) {
                throw new UnauthorizedException('Refresh token is null');
            }

            const payload = await this.jwtService.verifyAsync(refreshToken, {
                ignoreExpiration: true,
            });

            const foundUser = await this.prismaService.user.findUnique({
                where: { id: payload.sub, is_deleted: false },
            });

            const compareToken = await this.hashHelper.compare(
                refreshToken,
                foundUser?.refresh_token || '',
            );
            if (!compareToken || !foundUser) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const token = await this.generateAccessToken(foundUser.id);

            return {
                message: 'Token refreshed successfully!',

                access_token: token.accessToken,
                refresh_token: token.refreshToken,
            };
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            } else if (e.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            } else {
                throw new UnauthorizedException('Invalid token');
            }
        }
    }

    private async createNewUser(dto: SignupDto) {
        const hashedPassword = await this.hashHelper.hashPassword(dto.password);
        const date = new Date(dto.birthDate).toISOString();
        return this.prismaService.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    first_name: dto.fullName,
                    email: dto.email,
                    phone_number: dto.phoneNumber,
                    password: hashedPassword,
                    date_of_birth: date,
                    gender: dto.gender,
                },
            });

            return user;
        });
    }
}
