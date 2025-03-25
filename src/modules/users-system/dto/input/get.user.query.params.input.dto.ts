import { BaseSortablePaginationParams } from '../../../../core/dto/base.query.params.input.dto';

export class GetUserQueryParams extends BaseSortablePaginationParams<UserSortBy> {
    sortBy = UserSortBy.CreatedAt;
    searchLoginTerm: string | null = null;
    searchEmailTerm: string | null = null;
}

export enum UserSortBy {
    CreatedAt = 'createdAt',
    login = 'login',
    email = 'email',
}
