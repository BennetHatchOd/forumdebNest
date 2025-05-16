import { MakeLikeHandler} from '@modules/blogging.platform/application/UseCase/make.like.usecase';
import { DeleteCommentHandler } from '@modules/blogging.platform/application/UseCase/delete.comment.usecase';
import { EditCommentHandler } from '@modules/blogging.platform/application/UseCase/edit.comment.usecase';

export const CommandHandlers = [
    MakeLikeHandler,
    DeleteCommentHandler,
    EditCommentHandler
];