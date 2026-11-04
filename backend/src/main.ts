import { NestFactory } from '@nestjs/core';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppModule } from './app.module';
import 'dotenv/config';
import { TskvLogger } from './logger/tskv.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(new TskvLogger());
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  if (process.env.NODE_ENV !== 'production') {
    const viteUrl = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173';
    app.use(
      createProxyMiddleware({
        target: viteUrl,
        changeOrigin: true,
        ws: true,
        pathFilter: (pathname) =>
          !pathname.startsWith('/api/afisha') &&
          !pathname.startsWith('/content/afisha'),
      }),
    );
  }

  await app.listen(3000);
}
bootstrap();
