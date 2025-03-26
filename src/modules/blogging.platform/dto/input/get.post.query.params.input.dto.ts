import { BaseSortablePaginationParams } from '../../../../core/dto/base.query.params.input.dto';

export class GetPostQueryParams extends BaseSortablePaginationParams<PostSortBy> {
    sortBy = PostSortBy.CreatedAt;
    searchBlogId: string | null = null;

    setBlogIdSearchParams(searchBlogId: string): void {
        this.searchBlogId = searchBlogId;
    }
}

export enum PostSortBy {
    CreatedAt = 'createdAt',
    Title = 'title',
    ShortDescription = 'shortDescription',
    Content = 'content',
    BlogId = 'blogId',
    BlogName = 'blogName',
}
