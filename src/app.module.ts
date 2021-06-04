import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { PostResolver } from './post/post.resolver';
import { UserResolver } from './user/user.resolver';
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      buildSchemaOptions: { dateScalarMode: 'timestamp' },
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, PostService,  UserResolver, PostResolver],
})
export class AppModule {}
