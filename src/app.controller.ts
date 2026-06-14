import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Health')
@ApiBearerAuth('access-token')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Protected API health check' })
  @ApiOkResponse({ description: 'API is healthy' })
  health() {
    return {
      status: 'OK',
      app: process.env.APP_NAME,
    };
  }
}
