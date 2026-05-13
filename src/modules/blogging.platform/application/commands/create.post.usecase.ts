
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '@modules/blogging.platform/infrastucture/post.repository';
import { BlogQueryRepository } from '@modules/blogging.platform/infrastucture/query/blog.query.repository';
import { PostInputDto } from '@modules/blogging.platform/dto/input/post.input.dto';
import { Post } from '@modules/blogging.platform/domain/post.entity';

export class CreatePostCommand extends Command<string> {
    constructor(
        public inputDto: PostInputDto,
    ) {
        super()}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand, string> {
    constructor(
        private postRepository: PostRepository,
        private blogQueryRepository: BlogQueryRepository,
    ) {}

    async execute({inputDto}: CreatePostCommand):Promise<string> {

        await this.blogQueryRepository.findByIdWithCheck(inputDto.blogId);
        const newPost: Post = Post.createInstance(inputDto);
        await this.postRepository.savePost(newPost);
        return newPost.id.toString();
    }
}