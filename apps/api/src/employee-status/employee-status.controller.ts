// controllers/employee-status.controller.ts

import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { EmployeeStatusService } from '../employee-status/employee-status.service';
import { EmployeeStatus, Status } from '@prisma/client';

@Controller('employee-status')
export class EmployeeStatusController {
  constructor(private readonly employeeStatusService: EmployeeStatusService) {}

  @Get()
  async getAllEmployeeStatus(): Promise<EmployeeStatus[]> {
    return this.employeeStatusService.getAllEmployeeStatus();
  }

  @Get(':userId')
  async getEmployeeStatus(@Param('userId') userId: string): Promise<EmployeeStatus | null> {
    return this.employeeStatusService.getEmployeeStatus(userId);
  }

  @Put(':userId')
  async updateEmployeeStatus(
    @Param('userId') userId: string,
    @Body('status') status: Status,
  ): Promise<EmployeeStatus> {
    return this.employeeStatusService.updateEmployeeStatus(userId, status);
  }
}
