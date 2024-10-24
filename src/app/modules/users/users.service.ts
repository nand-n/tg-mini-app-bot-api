import { ForbiddenException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';
import { PermissionType } from '../auth/autherization/permission.type';
import { BalanceService } from '../balances/balance.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
    private readonly balanceService: BalanceService,

  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.balanceService.createBalance(user.id , {diceBalance:0,
      kenoBalance:0,
      bingoBalance:0})
    return await this.userRepository.save(user);
  }

  async findAll(
    options: IPaginationOptions,
    orderBy = 'id',
    orderDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Pagination<User>> {
    return this.paginationService.paginate<User>(
      this.userRepository,
      'p',
      options,
      orderBy,
      orderDirection,
    );
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOneBy({id});
    } catch (error) {
      return error
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRepository.update({ id }, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }

  async updateBalance(userId: string, newBalance: number): Promise<User> {
    const user = await this.findOne(userId);


    user.diceBalance = newBalance;

    return await this.userRepository.save(user);
  }
  async remove(id: string) {
    const doesExist = await this.userRepository.findOne({ where: { id } });
    if (!doesExist) {
      throw new Error(`User with id ${id} not found.`);
    }
    return await this.userRepository.softDelete({ id });
  }

  async assignRole(id: string, role: Role, currentUser: User): Promise<User> {
    this.ensureSuperuser(currentUser);
    const user = await this.findOne(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async updatePermissions(id: string, permissions: PermissionType[] , currentUser: User): Promise<User> {
    this.ensureSuperuser(currentUser);
    const user = await this.findOne(id);
    user.permissions = permissions;
    return this.userRepository.save(user);
  }

  private ensureSuperuser(currentUser: User): void {
    if (currentUser.role !== Role.SuperAdmin) {
      throw new ForbiddenException('You do not have permission to perform this action.');
    }
  }
}
