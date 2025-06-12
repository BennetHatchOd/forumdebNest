import { Module } from '@nestjs/common';
import { BlogController } from './api/blog.controller';
import { BlogQueryRepository } from './infrastucture/query/blog.query.repository';
import { BlogRepository } from './infrastucture/blog.repository';
import { PostRepository } from './infrastucture/post.repository';
import { PostQueryRepository } from './infrastucture/query/post.query.repository';
import { PostController } from './api/post.controler';
import { UserQueryExternalRepository } from '../users-system/infrastucture/query/user.query.external.repository';
import { CommandHandlers } from '@modules/blogging.platform/application/UseCase';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '@core/auth.module';
import { ReadUserIdGuard } from '@core/guards/read.userid';
import { DatabaseModule } from '@core/database.module';
import { BlogQueryController } from '@modules/blogging.platform/api/blog.query.controller';
import { PostQueryController } from '@modules/blogging.platform/api/post.query.controler';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        DatabaseModule,
    ],
    controllers: [
        BlogController,
        BlogQueryController,
        PostQueryController,
        PostController,
    //    CommentController
    ],
    providers: [
        ...CommandHandlers,
        ReadUserIdGuard,
        BlogQueryRepository,
        BlogRepository,
        PostQueryRepository,
        PostRepository,
        // CommentService,
        // CommentQueryRepository,
        // CommentRepository,
        // LikeRepository,
        // LikesQueryRepositories,
        UserQueryExternalRepository,
    ],
})
export class BloggingPlatformModule {}
