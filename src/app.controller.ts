import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({
    description: '실행되는지 확인 하기 위한 api',
  })
  @ApiOkResponse({
    description: '서버 작동시 200 호출',
    example: {
      status: 200,
      data: 'Test Ping',
      message: '요청이 성공적으로 처리되었습니다.',
    },
  })
  @Get()
  test(): string {
    return 'Test Ping';
  }
}
