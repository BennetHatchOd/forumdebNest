import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogController } from './api/blog.controller';
import { BlogService } from './apllication/blog.service';
import { BlogQueryRepository } from './infrastucture/query/blog.query.repository';
import { BlogRepository } from './infrastucture/blog.repository';
import { Post, PostSchema } from './domain/post.entity';
import { PostService } from './apllication/post.service';
import { PostRepository } from './infrastucture/post.repository';
import { PostQueryRepository } from './infrastucture/query/post.query.repository';
import { Comment, CommentSchema } from './domain/comment.entity';
import { CommentController } from './api/comment.controller';
import { CommentService } from './apllication/comment.service';
import { CommentQueryRepository } from './infrastucture/query/comment.query.repository';
import { CommentRepository } from './infrastucture/comment.repository';
import { PostController } from './api/post.controler';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Post.name, schema: PostSchema },
        ]),
    ],
    controllers: [
        BlogController,
        PostController,
        CommentController],
    providers: [
        BlogService,
        PostService,
        CommentService,
        BlogQueryRepository,
        PostQueryRepository,
        CommentQueryRepository,
        BlogRepository,
        PostRepository,
        CommentRepository,
    ],
})
export class BloggingPlatformModule {}
