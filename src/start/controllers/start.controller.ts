import { Controller, Get, Redirect, Render, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('')
export class StartController {
  @Get('/')
  @Redirect('/auth')
  start() {
    // Is user logged in?  If not, redirect to auth selection.
    // FIXME: For initial implementation ,jsut redirect immediately.  Figure out detection after.
  }

  @Get('/launch')
  @UseGuards(JwtAuthGuard)
  @Render('')
  launchClient() {
    // FIXME: Start here with launching the client.
    return {
      message: 'success!',
    };
  }
}
