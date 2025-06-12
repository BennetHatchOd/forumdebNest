// import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
//
// import { CommentRepository } from '@modules/blogging.platform/infrastucture/comment.repository';
// import { CommentDocument } from '@modules/blogging.platform/domain/comment.entity';
// import { DomainException } from '@core/exceptions/domain.exception';
// import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
// import { EditCommentDto } from '@modules/blogging.platform/dto/edit/edit.comment.dto';
//
// export class EditCommentCommand extends Command<void> {
//     constructor(
//         public editDto: EditCommentDto,
//     ) {
//         super()}
// }
//
// @CommandHandler(EditCommentCommand)
// export class EditCommentHandler implements ICommandHandler<EditCommentCommand> {
//     constructor(
//         private commentRepository: CommentRepository,
//     ) {
//     }
//
//     async execute({ editDto }: EditCommentCommand): Promise<void> {
//
//         const foundComment: CommentDocument = await this.commentRepository.getCommentById(editDto.targetId);
//
//         if(foundComment.commentatorInfo.userId !== editDto.userId)
//             throw new DomainException({
//                 message: "comment is not your own",
//                 code: DomainExceptionCode.Forbidden,
//             });
//
//         foundComment.update(editDto.content)
//         await this.commentRepository.save(foundComment);
//         return;
//     }
// }
