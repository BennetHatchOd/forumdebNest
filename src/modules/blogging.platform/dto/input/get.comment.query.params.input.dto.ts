import { BaseSortablePaginationParams } from '../../../../core/dto/base.query.params.input.dto';

export class GetCommentQueryParams extends BaseSortablePaginationParams<CommentSortBy> {
    sortBy = CommentSortBy.CreatedAt;
    searchParentPostId: string | null = null;

    // для поиска всех комментов соответсвующих посту с id равным parentPostId
    // устанавливает в query из метода Get, строку поиска
    //
    setParentPostIdSearchParams(parentPostId: string): void {
        this.searchParentPostId = parentPostId;
    }
}

export enum CommentSortBy {
    CreatedAt = 'createdAt',
    content = 'content',
}