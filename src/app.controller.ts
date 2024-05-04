import { AppService } from './app.service'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('x')
  @UseGuards(AuthGuard('twitter'))
  async xLogin() { }

  @Get('x/callback')
  async xCallback(@Req() req: Request, @Res() res: Response) {
    res.redirect('https://memegoat.io/challenges')
  }
}
