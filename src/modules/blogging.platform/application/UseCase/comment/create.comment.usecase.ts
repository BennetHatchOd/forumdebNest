import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputDto } from '@modules/blogging.platform/dto/input/comment.input.dto';
import { CreateCommentDto } from '@modules/blogging.platform/dto/create/create.comment.dto';
import { Comment } from '@modules/blogging.platform/domain/comment.entity';
import { PostRepository } from '@modules/blogging.platform/infrastucture/post.repository';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { CommentRepository } from '@modules/blogging.platform/infrastucture/comment.repository';

export class CreateCommentCommand extends Command<number> {
    constructor(
        public postId: number,
        public comment: CommentInputDto,
        public userId: number,
    ) {
        super()}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
    implements ICommandHandler<CreateCommentCommand>
{
    constructor(
        private commentRepository: CommentRepository,
        private postRepository: PostRepository,
        ) {}

    async execute({
        postId,
        comment,
        userId,
    }: CreateCommentCommand): Promise<number> {

        if(!await this.postRepository.findById(postId))
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound,
            });

        const createCommentDto: CreateCommentDto =
            CreateCommentDto.createInstance(postId, comment, userId);
        const newComment: Comment = Comment.createInstance(createCommentDto);
        await this.commentRepository.save(newComment);
        return newComment.id!;
    }
}
