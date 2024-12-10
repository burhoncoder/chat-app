import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtModuleConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get('JWT_SECRET'),

      signOptions: {
        expiresIn: configService.get('JWT_EXPIRES_IN'),
      },
    };
  },
};
