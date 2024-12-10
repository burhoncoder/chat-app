import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashingService } from '../../../user/app/services/hashing.service';
import { SignInDto } from '../dto/sign-in.dto';
import { UserService } from '../../../user/app/services/user.service';
import { AuthPayload } from '../../domain/auth.payload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto) {
    try {
      const user = await this.userService.findByUsername(dto.username);
      const isPasswordEqual = await this.hashingService.compare(
        dto.password,
        user.password,
      );

      if (!isPasswordEqual) {
        throw new UnauthorizedException('Username or password is incorrect');
      }

      const jwtPayload: AuthPayload = {
        userId: user.id,
      };
      return {
        accessToken: await this.jwtService.signAsync(jwtPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Username or password is incorrect');
    }
  }

  async validateToken(token: string): Promise<AuthPayload> {
    return this.jwtService.verifyAsync<AuthPayload>(token);
  }
}
