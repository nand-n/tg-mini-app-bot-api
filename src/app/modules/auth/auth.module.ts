import { Module } from "@nestjs/common";
import { BcryptService } from "./hashing/bcrypt.service";
import { HashingService } from "./hashing/hashing.service";
import { AuthenticationController } from "./authentication/authentication.controller";
import { AuthenticationService } from "./authentication/authentication.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AccessTokenGuard } from "./authentication/guards/access-token.guard";
import { AuthenticationGuard } from "./authentication/guards/authentication.guard";
import { User } from "../users/entities/user.entity";
import { RolesGuard } from "./autherization/guards/roles.guard";
import { RefreshTokenIdsStorage } from "./authentication/refres-token-ids.storage";
import { RefreshToken } from "./authentication/entities/refres-token.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User , RefreshToken]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    RefreshTokenIdsStorage,
    AccessTokenGuard,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class AuthModule {}