import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogController } from './api/blog.controller';
import { BlogService } from './application/blog.service';
import { BlogQueryRepository } from './infrastucture/query/blog.query.repository';
import { BlogRepository } from './infrastucture/blog.repository';
import { Post, PostSchema } from './domain/post.entity';
import { PostService } from './application/post.service';
import { PostRepository } from './infrastucture/post.repository';
import { PostQueryRepository } from './infrastucture/query/post.query.repository';
import { Comment, CommentSchema } from './domain/comment.entity';
import { CommentController } from './api/comment.controller';
import { CommentService } from './application/comment.service';
import { CommentQueryRepository } from './infrastucture/query/comment.query.repository';
import { CommentRepository } from './infrastucture/comment.repository';
import { PostController } from './api/post.controler';
import { UserQueryExternalRepository } from '../users-system/infrastucture/query/user.query.external.repository';
import { User, UserSchema } from '../users-system/domain/user.entity';
import { CommandHandlers } from '@modules/blogging.platform/application/UseCase';
import { CqrsModule } from '@nestjs/cqrs';
import { LikeRepository } from '@modules/blogging.platform/infrastucture/like.repository';
import { Like, LikeSchema } from '@modules/blogging.platform/domain/like.entity';
import { LikesQueryRepositories } from '@modules/blogging.platform/infrastucture/query/likes.query.repositories';
import { AuthModule } from '@core/auth.module';
import { ReadUserIdGuard } from '@core/guards/read.userid';

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Post.name, schema: PostSchema },
            { name: User.name, schema: UserSchema },
            { name: Like.name, schema: LikeSchema },
        ]),
    ],
    controllers: [
        BlogController,
        PostController,
        CommentController],
    providers: [
        ...CommandHandlers,
        ReadUserIdGuard,
        BlogService,
        BlogQueryRepository,
        BlogRepository,
        PostService,
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
