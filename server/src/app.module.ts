import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, TodosModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
