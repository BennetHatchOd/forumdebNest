import { BaseSortablePaginationParams } from '../../../../core/dto/base.query.params.input.dto';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum PostSortBy {
    CreatedAt = 'createdAt',
    Title = 'title',
    ShortDescription = 'shortDescription',
    Content = 'content',
    BlogId = 'blogId',
    BlogName = 'blogName',
}

export class GetPostQueryParams extends BaseSortablePaginationParams<PostSortBy> {
    @IsEnum(PostSortBy)
    sortBy = PostSortBy.CreatedAt;

    @IsOptional()
    @Type(()=> Number)
    @IsNumber()
    @Min(1)
    searchBlogId?: number;

    // для поиска всех постов, соответствующих блогу с id равным searchBlogId
    // устанавливает в query из метода Get, строку поиска
    //
    setBlogIdSearchParams(searchBlogId?: number): void {
        this.searchBlogId = searchBlogId;
    }
}

