import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentRepository } from '@modules/blogging.platform/infrastucture/comment.repository';
import { CommentInputDto } from '@modules/blogging.platform/dto/input/comment.input.dto';
import { CreateCommentDto } from '@modules/blogging.platform/dto/create/create.comment.dto';
import { Comment } from '@modules/blogging.platform/domain/comment.entity';

export class CreateCommentCommand extends Command<string> {
    constructor(
        public postId: string,
        public comment: CommentInputDto,
        public userId: string,
    ){ super()}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand, string> {
    constructor(
        private commentRepository: CommentRepository,
    ) {
    }

    async execute({ postId, comment, userId }: CreateCommentCommand): Promise<string> {

        const createDto: CreateCommentDto = {
            postId: +postId,
            content: comment.content,
            userId: +userId};
        const newComment: Comment = Comment.createInstance(createDto);
        await this.commentRepository.saveComment(newComment);
        return newComment.id.toString();
    }
}