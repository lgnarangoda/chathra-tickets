import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ id: number; email: string; name: string }> {
    // Note: Authentication is now handled by Supabase
    // This method creates a local user record that syncs with Supabase user
    const newUser = this.userRepository.create({
      email: createUserDto.username, // Map username to email
      name: createUserDto.username, // Also set name to username
      passwordHash: '', // Not used anymore, Supabase handles authentication
    });
    const saved = await this.userRepository.save(newUser);

    return {
      id: saved.userId,
      email: saved.email,
      name: saved.name,
    };
  }

  async createOrUpdateFromSupabase(
    supabaseUserId: string,
    email: string,
    name?: string,
    phone?: string,
  ): Promise<User> {
    // Check if user already exists by Supabase ID or email
    let user = await this.userRepository.findOne({
      where: [{ supabaseUserId }, { email }],
    });

    if (user) {
      // Update existing user
      user.supabaseUserId = supabaseUserId;
      user.email = email;
      if (name) user.name = name;
      if (phone) user.phone = phone;
      return await this.userRepository.save(user);
    }

    // Create new user
    const userData: Partial<User> = {
      supabaseUserId: supabaseUserId,
      email: email,
      name: name || email,
      phone: phone || undefined,
      passwordHash: undefined, // Supabase handles authentication
    };
    
    const newUser = this.userRepository.create(userData);
    const saved = await this.userRepository.save(newUser);
    return saved;
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async findBySupabaseUserId(supabaseUserId: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { supabaseUserId } });
    return user ?? undefined;
  }
}
