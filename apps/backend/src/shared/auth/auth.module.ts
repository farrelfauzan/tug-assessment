import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { getJwtSecret } from './jwt.config';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: getJwtSecret()
    })
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard]
})
export class AppAuthModule {}
