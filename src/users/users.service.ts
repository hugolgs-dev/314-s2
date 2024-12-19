import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'ID ${id} n'a pas été trouvé`,
      );
    }
    return user;
  }

  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async delete(@Param('id') id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'ID ${id} n'a pas été trouvé`,
      );
    }
    await this.userRepository.delete(user);
  }
}
