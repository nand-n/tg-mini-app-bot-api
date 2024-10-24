import {
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
  } from "@nestjs/common";
  import { InjectRepository } from "@nestjs/typeorm";
  import { Repository } from "typeorm";
  import { HashingService } from "../hashing/hashing.service";
  import { JwtService } from "@nestjs/jwt";
  import jwtConfig from "../config/jwt.config";
  import { ConfigType } from "@nestjs/config";
  import { RefreshTokenDto } from "./dto/refresh-token.dto";
  import { randomUUID } from "crypto";
import { User } from "../../users/entities/user.entity";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { ActiveUserData } from "../interface/active-user-data.interface";
import { InvalidateRefreshTokenError } from "./errors/invalidate-refresh-toke.error";
import { RefreshTokenIdsStorage } from "./refres-token-ids.storage";
import { Role } from "../../users/enums/role.enum";
import { BalanceService } from "../../balances/balance.service";
  
  @Injectable()
  export class AuthenticationService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly hashingService: HashingService,
      private readonly jwtService: JwtService,
      @Inject(jwtConfig.KEY)
      private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
      private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly balanceService: BalanceService,

    ) {}
  
    async signUp(signUpDto: SignUpDto) {
      try {
        const user = new User();
        user.name = signUpDto.name;
        user.password = await this.hashingService.hash(signUpDto.password);
        user.email = signUpDto.email;
        user.phone = signUpDto.phone;
        user.telegramUser = signUpDto.telegramUser;
        user.role = signUpDto.role || Role.Regular;
        user.permissions = signUpDto.permissions || [];
        const createdUser = await this.userRepository.save(user);
        await this.balanceService.createBalance(createdUser.id , {diceBalance:0,
          kenoBalance:0,
          bingoBalance:0})
        return  createdUser
      } catch (err) {
        const pgUniqueViolationCode = "23505";
        if (err.code === pgUniqueViolationCode) {
          throw new ConflictException("User already exists");
        }
        throw err;
      }
    }
  
    async signIn(signInDto: SignInDto) {
      const user = await this.userRepository.findOneBy({
        email: signInDto.email,
      });
      if (!user) {
        throw new UnauthorizedException("User does not exist");
      }
      const isEqual = await this.hashingService.compare(
        signInDto.password,
        user.password,
      );
      if (!isEqual) {
        throw new UnauthorizedException("Wrong password");
      }
      const tokens = await this.generateTokens(user);
      delete user.password 
      delete user.deletedAt
      delete user.payments
      delete user.tickets
      delete user.ticketsCreatedBy
      delete user.updatedAt
      delete user.createdAt
      return {...tokens , user }
    }
  
    async generateTokens(user: User) {
      const refreshTokenId = randomUUID();
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken<Partial<ActiveUserData>>(
          user.id,
          this.jwtConfiguration.accessTokenTtl,
          { email: user.email, role: user.role },
        ),
        this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
          refreshTokenId,
        }),
      ]);
      await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
      return {
        accessToken,
        refreshToken,
      };
    }
  
    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
      try {
        const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
          Pick<ActiveUserData, "sub"> & { refreshTokenId: string }
        >(refreshTokenDto.refreshToken, {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        });
        const user = await this.userRepository.findOneOrFail({
          where: { id: sub },
        });
        const isValid = await this.refreshTokenIdsStorage.validate(
          user.id,
          refreshTokenId,
        );
        if (isValid) {
          await this.refreshTokenIdsStorage.invalidate(user.id);
        } else {
          throw new Error("Refresh Token is invalid");
        }
        return this.generateTokens(user);
      } catch (err) {
        if (err instanceof InvalidateRefreshTokenError) {
          throw new UnauthorizedException("Access denied");
        }
        throw new UnauthorizedException();
      }
    }
  
    private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
      return await this.jwtService.signAsync(
        {
          sub: userId,
          ...payload,
        },
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn,
        },
      );
    }
  }