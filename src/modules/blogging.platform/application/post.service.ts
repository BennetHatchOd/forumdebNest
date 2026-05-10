import { Injectable } from '@nestjs/common';
import { PostRepository } from '../infrastucture/post.repository';
import { Post } from '../domain/post.entity';
import { PostInputDto } from '../dto/input/post.input.dto';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';
import { PostByBlogInputDto } from '@modules/blogging.platform/dto/input/post.by.blog.input.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { PostParamsIdInputDto } from '@core/dto/input/post.params.id.input.dto';

@Injectable()
export class PostService {
    constructor(
        private postRepository: PostRepository,
        private blogQueryRepository: BlogQueryRepository,
    ) {}

    async create(inputItem: PostInputDto): Promise<string> {
        const blogName
            = (await this.blogQueryRepository.findByIdWithCheck(inputItem.blogId)).name
        const newPost: Post = Post.createInstance(inputItem, blogName);
        await this.postRepository.savePost(newPost);
        return newPost.id.toString();
    }

    async edit(idDto: PostParamsIdInputDto, editData: PostByBlogInputDto): Promise<void> {

        const post: Post | null = await this.postRepository.findByIdWithoutBlog(idDto.id);

        if(!post || post.blogId !== +idDto.blogId)
            throw new DomainException({
                message: 'post with ${id}  not found',
                code: DomainExceptionCode.NotFound});

        post.update(editData);
        this.postRepository.savePost(post);
        return;
    }

    async delete(idDto: PostParamsIdInputDto): Promise<void> {
        const post: Post | null = await this.postRepository.findByIdWithoutBlog(idDto.id);

        if(!post || post.blogId !== +idDto.blogId)
            throw new DomainException({
                message: 'post with ${id}  not found',
                code: DomainExceptionCode.NotFound});

        post.delete();
        this.postRepository.savePost(post);
        return;

    }
}
