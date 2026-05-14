import { Module } from '@nestjs/common';
import { BlogAdminController } from './api/blog.admin.controller';
import { BlogQueryRepository } from './infrastucture/query/blog.query.repository';
import { BlogRepository } from './infrastucture/blog.repository';
import { PostRepository } from './infrastucture/post.repository';
import { PostQueryRepository } from './infrastucture/query/post.query.repository';
import { CommentController } from './api/comment.controller';
import { CommentQueryRepository } from './infrastucture/query/comment.query.repository';
import { CommentRepository } from './infrastucture/comment.repository';
import { PostController } from './api/post.controler';
import { UserQueryExternalRepository } from '../users-system/infrastucture/query/user.query.external.repository';
import { CommandHandlers } from 'src/modules/blogging.platform/application/commands';
import { CqrsModule } from '@nestjs/cqrs';
import { LikeRepository } from '@modules/blogging.platform/infrastucture/like.repository';
import { AuthModule } from '@core/auth.module';
import { ReadUserIdGuard } from '@core/guards/read.userid';
import { DatabaseModule } from '@core/database.module';
import { BlogController } from '@modules/blogging.platform/api/blog.controller';
import { QueryHandlers } from '@modules/blogging.platform/application/queries';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        DatabaseModule,
    ],
    controllers: [
        BlogAdminController,
        BlogController,
        PostController,
        CommentController],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ReadUserIdGuard,
        BlogQueryRepository,
        BlogRepository,
        PostQueryRepository,
        PostRepository,
        CommentQueryRepository,
        CommentRepository,
        LikeRepository,
        UserQueryExternalRepository,
    ],
})
export class BloggingPlatformModule {}
