import { BaseSortablePaginationParams } from '../../../../core/dto/base.query.params.input.dto';

export class GetBlogQueryParams extends BaseSortablePaginationParams<BlogSortBy> {
    sortBy = BlogSortBy.CreatedAt;
    searchNameTerm: string | null = null;
}

export enum BlogSortBy {
    CreatedAt = 'createdAt',
    Description = 'description',
    WebsiteUrl = 'websiteUrl',
    Name = 'name',
}
