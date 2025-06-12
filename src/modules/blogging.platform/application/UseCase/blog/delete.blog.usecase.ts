import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { BlogEditDto } from '@modules/blogging.platform/dto/edit/blog.edit.dto';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { Blog } from '@modules/blogging.platform/domain/blog.entity';

export class DeleteBlogCommand extends Command<void> {
    constructor(
        public id: number,
    ) {
        super()}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
    constructor(
        private blogRepository: BlogRepository,
    ) {
    }

    async execute({ id }: DeleteBlogCommand): Promise<void> {

        const blog: Blog | null = await this.blogRepository.findById(id);

        if (!blog)
            throw new DomainException({
                message: 'blog with id-${id} not found',
                code: DomainExceptionCode.NotFound});
        blog.delete();
        await this.blogRepository.save(blog);
        return;
    }
}
