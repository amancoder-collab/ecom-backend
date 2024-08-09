import { JwtService } from '@nestjs/jwt';

export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  async signToken(payload: { id: string; email: string }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret is not defined in the environment.');

    return this.jwtService.signAsync(payload, { secret });
  }

  
}
