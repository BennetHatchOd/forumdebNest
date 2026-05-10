import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogAdminController } from './api/blog.admin.controller';
import { BlogQueryRepository } from './infrastucture/query/blog.query.repository';
import { BlogRepository } from './infrastucture/blog.repository';
import { PostRepository } from './infrastucture/post.repository';
import { PostQueryRepository } from './infrastucture/query/post.query.repository';
import { Comment, CommentSchema } from './domain/comment.entity';
import { CommentController } from './api/comment.controller';
import { CommentService } from './application/comment.service';
import { CommentQueryRepository } from './infrastucture/query/comment.query.repository';
import { CommentRepository } from './infrastucture/comment.repository';
import { PostController } from './api/post.controler';
import { UserQueryExternalRepository } from '../users-system/infrastucture/query/user.query.external.repository';
import { CommandHandlers } from '@modules/blogging.platform/application/UseCase';
import { CqrsModule } from '@nestjs/cqrs';
import { LikeRepository } from '@modules/blogging.platform/infrastucture/like.repository';
import { Like, LikeSchema } from '@modules/blogging.platform/domain/like.entity';
import { LikesQueryRepositories } from '@modules/blogging.platform/infrastucture/query/likes.query.repositories';
import { AuthModule } from '@core/auth.module';
import { ReadUserIdGuard } from '@core/guards/read.userid';
import { DatabaseModule } from '@core/database.module';
import { BlogController } from '@modules/blogging.platform/api/blog.controller';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        DatabaseModule,
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: Like.name, schema: LikeSchema },
        ]),
    ],
    controllers: [
        BlogAdminController,
        BlogController,
        PostController,
        CommentController],
    providers: [
        ...CommandHandlers,
        ReadUserIdGuard,
        BlogQueryRepository,
        BlogRepository,
        PostQueryRepository,
        PostRepository,
        CommentService,
        CommentQueryRepository,
        CommentRepository,
        LikeRepository,
        LikesQueryRepositories,
        UserQueryExternalRepository,
    ],
})
export class BloggingPlatformModule {}
