import * as firebaseAdmin from 'firebase-admin';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';


import { AppModule } from './app/app.module';
import { ServiceAccount } from 'firebase-admin/lib/app/credential';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const globalPrefix = 'api';

const swaggerConfig = new DocumentBuilder()
  .setTitle('cta-api')
  .setVersion('0.0')
  .build();

const serviceAccount: ServiceAccount = {
  projectId: "crypto-trade-agents",
  privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmXfmAquB8AmzG\nGXkruq8cTPoPtuFBbujM4hhnYhCsnAWYAAe3az1MNipQ7qnmQQVlXb12kp58ZGgx\nWYxoA6djmnnbk/j+d9xMkeJOrmGwpTa6imdo+IkJbQb0D1OcoxRxkAuEYktFOAcf\nnSYxkjeDLZe0MNvB39tUxNuDism6oX7qd99GI4v1GnQaLtPlzJFUXcUbufhRo/l8\nb0IJ/q2zS3CVAThVuEVfm6qBQUcc5iNiSfkFoaF7xR6vcHZ3+gBLgZFtKdT50dhr\n7kovLvsNo335HM12vdvD7aEJtUhkaNAPVRw/w2fqrh2Z6tXFVYAGNltUCichYPek\naxxhwDefAgMBAAECggEABL4XzCg5RBUP4Xq9jYFGG8dj+zzD8qKadTC8Z7D+7wXM\nyp89VM6WXsiSgNeF8Pdvvk8J4uxVAUOmSNxCen7cs/DhsSS1S8N98/hv/kWa7YQG\nlEXBK4KEpdBfrSMWUDHBy1YHTo3nLKu8ky6z9XWZ1VEcG7FRzI5J3qSn+wrRs/S+\nNk+7vXkwT6qNof2EMcYJBvbBncUSJ68Ge+/iPc+g0cGBREk5KEVL38NlnMkmAq4Q\nBCuPenNpt1D73aKFoeGy6/XPCHtnW7XC7/arG0w22MYBah9vfbLEu0GLmaP6SS6c\nf79o2nxbwlmZkuk+/Ixb5hl752bT6kXHX0Oy+w7I9QKBgQDc6JpdNFOV0j8nro3Y\nxcT7nQouhTXwjP5hx5ZSVH2vQ/WXdVQ/CHQEPcm1bkb2QoZsyNDlk1SdJchBja0Q\nA8xN7o80FayAjqd4VpHPpe+O90ckcCluWhFnnUZYZncwPkV2Xh8BsvRY4sKnEfnc\nRVMbwxotOLILDdj05mhL7pN49QKBgQDAy2d3GOgMayJytYxyd/co3tV6ymHuCmDh\n0iFNwH48RxrupJW93n2SVMoSiZlZ0w9vCgDfgJNmI0YUifAnR2cUNzgDIOIsE2Mp\njVQONzcnQWAxVz+Vo8++UiBeF/Ya/IS/bpB7iM+AC7iXJrn40ft4SHTeXiG8FpZ9\nCclpY1WhwwKBgQDWn0YZ95Sdor6pFvXI/Zv7uP8DY3icVN9wsDBjnKLffO9GTz+i\nXdwZos4t7w4Sg1+GoTQTV6iFZQfCaJsTTB1aOcP3nncSD4a1a6YOT/EGvUfpJu+Z\nvvfZ6vtFN4fk3xstfRQy2mJ7WRQ0rUpLry6nck4kUUjpZHK8vH3oB8pPYQKBgEl2\n+MUkQ4A/7s+BKLSRzCfRyc1Rg0GeyM4kMTacjD3R5oxbQQgp2PXCw4GO11WoHHB2\ngmCocQJxnInFCjMdfUTxybE/fY/ID3hM92O3XJfjzJDgq0UNN+NRDi5suQYNhVQh\nAINiXZdwX/WQ9zq+YTGzgn0dp4MxpESfTxWOmZnbAoGAFOBXMr2iAw1X0TlCC8dd\njKi027si7ZXEKeZju+mbJIEyV4Slg7I5yAZ0Ox2Qlg1Soz1Z8ILf+kNPwDBMfOD4\nKE9DyRXsrzMqW+NE5EmDLxeg1hLNaUv9Q5d0X1BC4Vg4Arx3sQm/+nPLZEDJn9qe\nukDnu/FYLR1AS6sI5W5DIUw=\n-----END PRIVATE KEY-----\n",
  clientEmail: "firebase-adminsdk-3jx2o@crypto-trade-agents.iam.gserviceaccount.com"
}

const firebaseConfig: firebaseAdmin.AppOptions = {
  databaseURL: 'https://crypto-trade-agents-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'crypto-trade-agents',
  storageBucket: 'crypto-trade-agents.appspot.com',
  credential: firebaseAdmin.credential.cert(serviceAccount)
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(globalPrefix, app, document);

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });

  Logger.log('Initializing firebase app: ' + firebaseConfig.projectId);
  firebaseAdmin.initializeApp(firebaseConfig);
  Logger.log('Firebase initialized.');
}

bootstrap();
