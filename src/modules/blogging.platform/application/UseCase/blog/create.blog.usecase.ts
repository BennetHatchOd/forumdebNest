import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { Blog } from '@modules/blogging.platform/domain/blog.entity';
import { BlogInputDto } from '@modules/blogging.platform/dto/input/blog.input.dto';

export class CreateBlogCommand extends Command<number> {
    constructor(
        public createDto: BlogInputDto,
    ) {
        super()}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
    constructor(
        private blogRepository: BlogRepository,
    ) {
    }

    async execute({ createDto }: CreateBlogCommand): Promise<number> {

        const blog: Blog = Blog.createInstance(createDto);

        await this.blogRepository.save(blog);
        return blog.id!;
    }
}
