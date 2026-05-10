import { MakeLikeHandler} from '@modules/blogging.platform/application/UseCase/make.like.usecase';
import { DeleteCommentHandler } from '@modules/blogging.platform/application/UseCase/delete.comment.usecase';
import { EditCommentHandler } from '@modules/blogging.platform/application/UseCase/edit.comment.usecase';
import { CreateBlogHandler } from '@modules/blogging.platform/application/UseCase/create.blog.usecase';
import { EditBlogHandler } from '@modules/blogging.platform/application/UseCase/edit.blog.usecase';
import { DeleteBlogHandler } from '@modules/blogging.platform/application/UseCase/delete.blog.usecase';
import { CreatePostHandler } from '@modules/blogging.platform/application/UseCase/create.post.usecase';
import { EditPostHandler } from '@modules/blogging.platform/application/UseCase/edit.post.usecase';
import { DeletePostHandler } from '@modules/blogging.platform/application/UseCase/delete.post.usecase';
import { CreateCommentHandler } from '@modules/blogging.platform/application/UseCase/create.comment.usecase';

export const CommandHandlers = [
    MakeLikeHandler,
    CreateCommentHandler,
    DeleteCommentHandler,
    EditCommentHandler,
    CreateBlogHandler,
    EditBlogHandler,
    DeleteBlogHandler,
    CreatePostHandler,
    EditPostHandler,
    DeletePostHandler,
];