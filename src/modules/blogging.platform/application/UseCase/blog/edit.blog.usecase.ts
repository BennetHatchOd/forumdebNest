import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { BlogEditDto } from '@modules/blogging.platform/dto/edit/blog.edit.dto';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { Blog } from '@modules/blogging.platform/domain/blog.entity';

export class EditBlogCommand extends Command<void> {
    constructor(
        public editDto: BlogEditDto,
    ) {
        super()}
}

@CommandHandler(EditBlogCommand)
export class EditBlogHandler implements ICommandHandler<EditBlogCommand> {
    constructor(
        private blogRepository: BlogRepository,
    ) {
    }

    async execute({ editDto }: EditBlogCommand): Promise<void> {

        const blog: Blog | null = await this.blogRepository.findById(editDto.id);

        if (!blog)
            throw new DomainException({
                message: 'blog with id-${id} not found',
                code: DomainExceptionCode.NotFound});
        blog.update(editDto);
        await this.blogRepository.save(blog);
        return;
    }
}
