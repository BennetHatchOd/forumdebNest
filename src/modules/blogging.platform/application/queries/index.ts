import { GetPostsByBlogHandler } from '@modules/blogging.platform/application/queries/get.posts.by.blog';
import { GetCommentsByPostQuery } from '@modules/blogging.platform/application/queries/get.comments.by.post';

export const QueryHandlers = [
    GetPostsByBlogHandler,
    GetCommentsByPostQuery,
];