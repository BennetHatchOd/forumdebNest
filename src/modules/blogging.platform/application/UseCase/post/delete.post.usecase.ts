import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputDto } from '@modules/blogging.platform/dto/input/post.input.dto';
import { PostRepository } from '@modules/blogging.platform/infrastucture/post.repository';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { Blog } from '@modules/blogging.platform/domain/blog.entity';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { Post } from '@modules/blogging.platform/domain/post.entity';


export class DeletePostCommand extends Command<void> {
    constructor(
        public id: number,
    ) {
        super()}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
    constructor(
        private postRepository: PostRepository,
    ) {
    }

    async execute({ id }: DeletePostCommand): Promise<void> {

        const post: Post | null = await this.postRepository.findById(id);
        if(!post)
            throw new DomainException({
                message: 'post with id-${i} not found',
                code: DomainExceptionCode.NotFound,
            });
        post.delete();

        await this.postRepository.save(post);
        return;
    }
}
