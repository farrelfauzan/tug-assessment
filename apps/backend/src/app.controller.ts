import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): { success: boolean; data: { status: string } } {
    return {
      success: true,
      data: {
        status: 'ok'
      }
    };
  }
}
