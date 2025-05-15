import { Injectable } from '@nestjs/common';
import { BlogViewDto } from '../../dto/view/blog.view.dto';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blog.entity';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetBlogQueryParams } from '../../dto/input/get.blog.query.params.input.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { EmptyPaginator } from '@core/dto/empty.paginator';
import { UserViewDto } from '@modules/users-system/dto/view/user.view.dto';

@Injectable()
export class BlogQueryRepository {

    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType, 
    ){}
    
    async  findByIdWithCheck(id: string): Promise<BlogViewDto> {
        if (!Types.ObjectId.isValid(id)) 
            throw new DomainException({
                message: 'blog not found',
                code: DomainExceptionCode.NotFound});

        const searchItem: BlogDocument | null = await this.BlogModel.findOne({
                                                    _id: new Types.ObjectId(id),
                                                    deletedAt: null
                                                });
        if(!searchItem)
            throw new DomainException({
                message: 'blog not found',
                code: DomainExceptionCode.NotFound});

        return BlogViewDto.mapToView(searchItem);
    }

    async find(queryReq: GetBlogQueryParams): Promise<PaginatedViewDto<BlogViewDto>> {

        const nameSearch = queryReq.searchNameTerm
            ? { name: { $regex: queryReq.searchNameTerm, $options: 'i' } }
            : {};
        const queryFilter: FilterQuery<Blog> = { ...nameSearch, deletedAt: null };
        const totalCount: number = await this.BlogModel.countDocuments(queryFilter);
        if(totalCount === 0)
            return new EmptyPaginator<BlogViewDto>();

        const blogs: Array<BlogDocument> = await this.BlogModel.find(queryFilter)
            .limit(queryReq.pageSize)
            .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
            .sort({ [queryReq.sortBy]: queryReq.sortDirection });

        const items = blogs.map(BlogViewDto.mapToView);

        return PaginatedViewDto.mapToView({
            items: items,
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount
        })
    }
}