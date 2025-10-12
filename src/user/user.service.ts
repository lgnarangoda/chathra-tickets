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
  ): Promise<Pick<User, 'id' | 'username' | 'isAdmin'>> {
    if (!createUserDto.password) {
      throw new Error('Password is required');
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.userRepository.create({
      username: createUserDto.username,
      passwordHash,
    });
    const saved = await this.userRepository.save(newUser);

    // Do not expose password_hash in the response
    const safeUser: Pick<User, 'id' | 'username' | 'isAdmin'> = {
      id: saved.id,
      username: saved.username,
      isAdmin: saved.isAdmin,
    };
    return safeUser;
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user ?? undefined;
  }
}
