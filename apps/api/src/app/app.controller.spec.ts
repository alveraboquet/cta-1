import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { auth } from 'firebase-admin';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();
  });

  describe('me', () => {
    it('should return user', () => {
      const appController = app.get<AppController>(AppController);
      const user = {} as auth.DecodedIdToken;
      expect(appController.getUser(user)).toEqual(user);
    });
  });
});
