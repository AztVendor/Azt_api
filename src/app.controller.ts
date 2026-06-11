import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      status: 'OK',
      app: process.env.APP_NAME,
    };
  }
}