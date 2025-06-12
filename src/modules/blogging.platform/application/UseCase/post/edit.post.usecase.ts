import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputDto } from '@modules/blogging.platform/dto/input/post.input.dto';
import { PostRepository } from '@modules/blogging.platform/infrastucture/post.repository';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { Blog } from '@modules/blogging.platform/domain/blog.entity';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { Post } from '@modules/blogging.platform/domain/post.entity';


export class EditPostCommand extends Command<void> {
    constructor(
        public id: number,
        public editDto: PostInputDto,
    ) {
        super()}
}

@CommandHandler(EditPostCommand)
export class EditPostHandler implements ICommandHandler<EditPostCommand> {
    constructor(
        private postRepository: PostRepository,
        private blogRepository: BlogRepository,
    ) {
    }

    async execute({id, editDto }: EditPostCommand): Promise<void> {

        if(!await this.postRepository.findById(editDto.blogId))
            throw new DomainException({
                message: 'blog with id-${editDto.blogId} not found',
                code: DomainExceptionCode.BlogIdNotCorrect,
                extension: [{
                    message:'blog with id-${editDto.blogId} not found',
                    field: 'blogId'
                }]
            });

        const post = await this.postRepository.findById(id);
        if(!post)
            throw new DomainException({
                message: 'post with id-${id} not found',
                code: DomainExceptionCode.NotFound,
            });

        post.update(editDto);
        await this.postRepository.save(post);
        return;
    }
}
