import { Inject, Injectable } from '@nestjs/common';
import { UserViewDto } from '../../dto/view/user.view.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetUserQueryParams } from '../../dto/input/get.user.query.params.input.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { EmptyPaginator } from '@core/dto/empty.paginator';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from '@core/constans/data.source';
import { User } from '@modules/users-system/domain/user.entity';
import { FilterQuery } from '@core/infrastucture/filter.query';


@Injectable()
export class UserQueryRepository {

    constructor(
        @Inject(DATA_SOURCE)private readonly dataSource: DataSource,
    ){}

    async  findById(id: string): Promise<UserViewDto> {
        // если пост не найден, выкидываем ошибку 404 прямо в репозитории

        const numericId = Number(id);
        if( !Number.isInteger(numericId) || numericId < 1)
            throw new DomainException({
                message: 'user not found',
                code: DomainExceptionCode.NotFound,
            });

        const {clause} = new FilterQuery<User>({
                id: numericId,
                deletedAt: null}).buildWhereClause();
        const user: User[] = await this.dataSource.query(`
            SELECT * FROM public."Users" ${clause}
                LIMIT 1;`,
            [numericId]);

        if(user.length == 0){
            throw new DomainException({
                message: 'user not found',
                code: DomainExceptionCode.NotFound});
        }
        return UserViewDto.mapToView(user[0]);
    }

    async find(queryReq: GetUserQueryParams): Promise<PaginatedViewDto<UserViewDto>> {

        const whereClausesAND: string[] = [`"deletedAt" IS NULL`];
        const whereClausesOR: string[] = [];
        const queryParams: any[] = [];

        if (queryReq.searchLoginTerm) {
            queryParams.push(`%${queryReq.searchLoginTerm}%`);
            whereClausesOR.push(`login ILIKE $${queryParams.length}`);
        }

        if (queryReq.searchEmailTerm) {
            queryParams.push(`%${queryReq.searchEmailTerm}%`);
            whereClausesOR.push(`email ILIKE $${queryParams.length}`);
        }

        if (whereClausesOR.length > 0) {
            const whereSqlOR = whereClausesOR.join(' OR ');
            whereClausesAND.push(`(${whereSqlOR})`);
        }
        const whereSql = whereClausesAND.join(' AND ');

        const sqlRequest = `FROM public."Users" WHERE ${whereSql}`;
        const sqlCount = `SELECT COUNT(*) AS count ${sqlRequest};`;
        const sql = ` SELECT * ${sqlRequest}
            ORDER BY "${queryReq.sortBy}" ${queryReq.sortDirection} 
            LIMIT ${queryReq.pageSize} OFFSET ${(queryReq.pageNumber - 1) * queryReq.pageSize};`;

        const totalCount: number = await this.dataSource.query(sqlCount + ';', queryParams);

        if(+totalCount[0].count === 0)
            return new EmptyPaginator<UserViewDto>();

        const users: User[] = await this.dataSource.query(sql, queryParams);

        const items = users.map(UserViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items: items,
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: +totalCount[0].count
        })

    }
}