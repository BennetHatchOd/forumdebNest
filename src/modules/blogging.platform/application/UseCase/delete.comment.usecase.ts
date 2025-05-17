import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { CommentRepository } from '@modules/blogging.platform/infrastucture/comment.repository';
import { Comment, CommentDocument, CommentModelType } from '@modules/blogging.platform/domain/comment.entity';
import { DeleteEntityDto } from '@modules/blogging.platform/dto/delete.entity.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

export class DeleteCommentCommand extends Command<void> {
    constructor(
        public deleteDto: DeleteEntityDto,
    ) {
        super()}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
    constructor(
        private commentRepository: CommentRepository,
    ) {
    }

    async execute({ deleteDto }: DeleteCommentCommand): Promise<void> {

        const foundComment: CommentDocument = await this.commentRepository.getCommentById(deleteDto.targetId);

        if(foundComment.commentatorInfo.userId !== deleteDto.userId)
            throw new DomainException({
                message: "comment is not your own",
                code: DomainExceptionCode.Forbidden,
            });

        foundComment.delete()
        await this.commentRepository.save(foundComment);
        return;
    }
}
