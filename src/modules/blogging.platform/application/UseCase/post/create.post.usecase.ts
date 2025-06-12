import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputDto } from '@modules/blogging.platform/dto/input/post.input.dto';
import { PostRepository } from '@modules/blogging.platform/infrastucture/post.repository';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { Blog } from '@modules/blogging.platform/domain/blog.entity';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { Post } from '@modules/blogging.platform/domain/post.entity';


export class CreatePostCommand extends Command<number> {
    constructor(
        public createDto: PostInputDto,
    ) {
        super()}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
    constructor(
        private postRepository: PostRepository,
        private blogRepository: BlogRepository,
    ) {
    }

    async execute({ createDto }: CreatePostCommand): Promise<number> {

        const blog: Blog | null = await this.blogRepository.findById(createDto.blogId)
        if(!blog)
            throw new DomainException({
                message: 'blog with id-${createDto.blogId} not found',
                code: DomainExceptionCode.BlogIdNotCorrect,
                extension: [{
                    message:'blog with id-${createDto.blogId} not found',
                    field: 'blogId'
                }]
            });
        const post = Post.createInstance(createDto);

     await this.postRepository.save(post);
     return post[0].id;
    }
}
