import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@Controller('customer/dashboard')
@ApiTags('Customer Dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
}
