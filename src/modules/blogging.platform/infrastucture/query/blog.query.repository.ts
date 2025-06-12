import { Inject, Injectable } from '@nestjs/common';
import { BlogViewDto } from '../../dto/view/blog.view.dto';
import { Blog } from '../../domain/blog.entity';
import { GetBlogQueryParams } from '../../dto/input/get.blog.query.params.input.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { EmptyPaginator } from '@core/dto/empty.paginator';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { User } from '@modules/users-system/domain/user.entity';
import { FilterQuery } from '@core/infrastucture/filter.query';
import { UserViewDto } from '@modules/users-system/dto/view/user.view.dto';

@Injectable()
export class BlogQueryRepository {

    constructor(
        @Inject(DATA_SOURCE) protected dataSource: DataSource,
        private blogRepository: BlogRepository
    ){}
    
    async  findByIdWithCheck(id: number): Promise<BlogViewDto> {

        const blog = await this.blogRepository.findById(id);
        if (!blog)
            throw new DomainException({
                message: 'blog not found',
                code: DomainExceptionCode.NotFound});

        return BlogViewDto.mapToView(blog);
    }

    async find(queryReq: GetBlogQueryParams): Promise<PaginatedViewDto<BlogViewDto>> {

        const {clause, values} = new FilterQuery<Blog>({
            name: {$like: queryReq.searchNameTerm},
            deletedAt: null}).buildWhereClause();

        const sqlRequest = `FROM public.blogs ${clause}`;
        const sqlCount = `SELECT COUNT(*) AS count ${sqlRequest};`;
        const totalCount = await this.dataSource.query(sqlCount + ';', values);
        if(queryReq.pageNumber > Math.ceil(+totalCount[0].count / queryReq.pageSize))
                queryReq.pageNumber = Math.ceil(+totalCount[0].count / queryReq.pageSize);

        const sql = ` SELECT * ${sqlRequest}
            ORDER BY "${queryReq.sortBy}" ${queryReq.sortDirection} 
            LIMIT ${queryReq.pageSize} OFFSET ${(queryReq.pageNumber - 1) * queryReq.pageSize};`;



        if(+totalCount[0].count === 0)
            return new EmptyPaginator<BlogViewDto>();

        const blogs: Blog[] = await this.dataSource.query(sql, values);

        const items = blogs.map(BlogViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items: items,
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: +totalCount[0].count
        })
    }
}