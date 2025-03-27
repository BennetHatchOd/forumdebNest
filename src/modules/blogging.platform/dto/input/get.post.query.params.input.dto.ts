import { BaseSortablePaginationParams } from '../../../../core/dto/base.query.params.input.dto';

export class GetPostQueryParams extends BaseSortablePaginationParams<PostSortBy> {
    sortBy = PostSortBy.CreatedAt;
    searchBlogId: string | null = null;

    // для поиска всех постов соответсвующих блогу с id равным searchBlogId
    // устанавливает в query из метода Get, строку поиска
    //
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
