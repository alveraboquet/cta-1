import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { auth } from 'firebase-admin';
import { User } from '@cta/api/auth';

@Controller()
export class AppController {
  constructor() {}

  @Get('me')
  @UseGuards(AuthGuard('firebase-jwt'))
  getUser(@User() user: auth.DecodedIdToken) {
    return user;
  }
}
