// services/employee-status.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeStatus, Status } from '@prisma/client';

@Injectable()
export class EmployeeStatusService {
  constructor(private prisma: PrismaService) {}

  async getAllEmployeeStatus(): Promise<EmployeeStatus[]> {
    const employeeStatuses = await this.prisma.employeeStatus.findMany({
      include: { user: true }, // Including the user relation
    });
   

    // Map through each employee status and append the username to it
    return employeeStatuses.map(employeeStatus => ({
      ...employeeStatus,
      username: employeeStatus.user?.username || null, // Retrieve the username or null if user not found
    }));
  }

  async getEmployeeStatus(userId: string): Promise<EmployeeStatus | null> {
    return this.prisma.employeeStatus.findFirst({ where: { userId } });
  }

  async updateEmployeeStatus(userId: string, status: Status): Promise<EmployeeStatus> {
    return this.prisma.employeeStatus.upsert({
      where: { id: 1 }, // Update the id according to your use case
      update: { status },
      create: { userId, status },
    });
  }
}
