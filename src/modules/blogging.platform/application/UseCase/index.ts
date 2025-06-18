import { EditBlogHandler } from '@modules/blogging.platform/application/UseCase/blog/edit.blog.usecase';
import { DeleteBlogHandler } from '@modules/blogging.platform/application/UseCase/blog/delete.blog.usecase';
import { CreateBlogHandler } from '@modules/blogging.platform/application/UseCase/blog/create.blog.usecase';
import { CreatePostHandler } from '@modules/blogging.platform/application/UseCase/post/create.post.usecase';
import { DeletePostHandler } from '@modules/blogging.platform/application/UseCase/post/delete.post.usecase';
import { EditPostHandler } from '@modules/blogging.platform/application/UseCase/post/edit.post.usecase';

export const CommandHandlers = [
    CreateBlogHandler,
    DeleteBlogHandler,
    EditBlogHandler,
    CreatePostHandler,
    DeletePostHandler,
    EditPostHandler,
];