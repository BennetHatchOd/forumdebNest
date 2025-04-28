import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostRepository } from '../infrastucture/post.repository';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { PostInputDto } from '../dto/input/post.input.dto';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Injectable()
export class PostService {
    constructor(
        private postRepository: PostRepository,
        private blogQueryRepository: BlogQueryRepository,
        @InjectModel(Post.name) private PostModel: PostModelType,
    ) {}

    async create(inputItem: PostInputDto): Promise<string> {
        const blogName
            = (await this.blogQueryRepository.findByIdWithCheck(inputItem.blogId)).name
        const newPost: PostDocument = await this.PostModel.createInstance(inputItem, blogName);
        await this.postRepository.save(newPost);
        return newPost._id.toString();
    }

    async edit(id: string, editData: PostInputDto): Promise<void> {

        const post: PostDocument | null = await this.postRepository.findById(id);

        if (!post)
            throw new DomainException({
                message: 'post with ${id} not found',
                code: DomainExceptionCode.NotFound});
        const blogName
            = (await this.blogQueryRepository.findByIdWithCheck(editData.blogId)).name
        post.update(editData, blogName);
        this.postRepository.save(post);
        return;
    }

    async delete(id: string): Promise<void> {
        const post: PostDocument | null = await this.postRepository.findById(id);

        if (!post)
            throw new DomainException({
                message: 'post with id-${id} not found',
                code: DomainExceptionCode.NotFound});
        post.delete();
        this.postRepository.save(post);
        return;

    }
}
