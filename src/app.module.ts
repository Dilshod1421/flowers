import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { SuperAdmin } from './super-admin/models/super-admin.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB,
      models: [SuperAdmin],
      autoLoadModels: true,
    }),
    SuperAdminModule,
  ],
})
export class AppModule {}
