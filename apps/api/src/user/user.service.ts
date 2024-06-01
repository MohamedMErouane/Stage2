import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService){}

  async findAll() {
    return this.prisma.user.findMany({});
  }
    
  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new ConflictException("Email is already registered.");
    }

    const username = dto.email.split('@')[0];
    let uniqueUsername = username;
    let counter = 1;

    while (true) {
      const userWithSameUsername = await this.prisma.user.findUnique({
        where: { username: uniqueUsername },
      });

      if (!userWithSameUsername) {
        break;
      } else {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }
    }
    
    dto.username = uniqueUsername;
    dto.image = '1.jpg';
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10),
        isAdmin: dto.isAdmin ?? false,
      }
    });

    const { password, isAdmin, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { password, ...result } = user;
    return result;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { password, ...result } = user;
    return result;
  }

  async updatePassword(dto: UpdatePasswordDto) {
    const { id, newPassword } = dto;
    return this.prisma.user.update({
      where: { id },
      data: { password: await hash(newPassword, 10) },
    });
  }

  async verifyEmail(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: new Date() }
    });
  }

  async updateUser(username: string, image: string | undefined, dto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username }
    });

    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }

    const { firstName, lastName, about, facebook, instagram, twitter, linkedIn } = dto;
    const updateData: any = { firstName, lastName, about, facebook, instagram, twitter, linkedIn };

    if (image !== undefined) {
      updateData.image = image;
    }

    return this.prisma.user.update({
      where: { username },
      data: updateData
    });
  }
}
