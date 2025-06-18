import { Inject, Injectable } from '@nestjs/common';
import { UserViewDto } from '../../dto/view/user.view.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetUserQueryParams, UserSortBy } from '../../dto/input/get.user.query.params.input.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { EmptyPaginator } from '@core/dto/empty.paginator';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '@core/constans/data.source';
import { User } from '@modules/users-system/domain/user.entity';
import { UserRepository } from '@modules/users-system/infrastucture/user.repository';
import { PostSortBy } from '@modules/blogging.platform/dto/input/get.post.query.params.input.dto';


@Injectable()
export class UserQueryRepository {

    constructor(
        @Inject(DATA_SOURCE)private readonly dataSource: DataSource,
        private userRepository: UserRepository
    ){}

    async  findById(id: number): Promise<UserViewDto> {
        // если пост не найден, выкидываем ошибку 404 прямо в репозитории

        const user = await this.userRepository.findById(id);
        if (!user)
            throw new DomainException({
                message: 'user not found',
                code: DomainExceptionCode.NotFound});

        return UserViewDto.mapToView(user);
    }

    async find(queryReq: GetUserQueryParams): Promise<PaginatedViewDto<UserViewDto>> {

        const whereClausesAND: string[] = [`"deletedAt" IS NULL`];
        const whereClausesOR: string[] = [];
        const values: any[] = [];

        if (queryReq.searchLoginTerm) {
            values.push(`%${queryReq.searchLoginTerm}%`);
            whereClausesOR.push(`login ILIKE $${values.length}`);
        }
        if (queryReq.searchEmailTerm) {
            values.push(`%${queryReq.searchEmailTerm}%`);
            whereClausesOR.push(`email ILIKE $${values.length}`);
        }
        if (whereClausesOR.length > 0) {
            const whereSqlOR = whereClausesOR.join(' OR ');
            whereClausesAND.push(`(${whereSqlOR})`);
        }
        const clause = 'WHERE ' + whereClausesAND.join(' AND ');

        const sqlRequest = `FROM public."Users" ${clause}`;
        const sqlCount = `SELECT COUNT(*) AS count ${sqlRequest};`;

        const totalCount = +(await this.dataSource.query(sqlCount + ';', values))[0].count;
        if(queryReq.pageNumber > Math.ceil(totalCount / queryReq.pageSize))
            queryReq.pageNumber = Math.ceil(totalCount / queryReq.pageSize);

        const collate = [UserSortBy.email, UserSortBy.login].includes(queryReq.sortBy)
            ? ' COLLATE "C"'
            : '';

        const sql = ` SELECT * ${sqlRequest}
            ORDER BY "${queryReq.sortBy}" ${collate} ${queryReq.sortDirection} 
            LIMIT ${queryReq.pageSize} OFFSET ${(queryReq.pageNumber - 1) * queryReq.pageSize};`;

        if(totalCount === 0)
            return new EmptyPaginator<UserViewDto>();

        const users: User[] = await this.dataSource.query(sql, values);

        const items = users.map(UserViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items: items,
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount
        })

    }
}