import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ id: number; email: string; name: string }> {
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      email: createUserDto.username, // Map username to email
      name: createUserDto.username, // Also set name to username
      passwordHash,
    });
    const saved = await this.userRepository.save(newUser);

    // Do not expose password_hash in the response
    return {
      id: saved.userId,
      email: saved.email,
      name: saved.name,
    };
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }
}
