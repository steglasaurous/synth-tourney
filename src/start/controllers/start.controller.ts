import { Controller, Get, Redirect } from '@nestjs/common';

@Controller('')
export class StartController {
  @Get('/')
  @Redirect('/auth')
  start() {
    // Is user logged in?  If not, redirect to auth selection.
    // FIXME: For initial implementation ,jsut redirect immediately.  Figure out detection after.
  }
}
