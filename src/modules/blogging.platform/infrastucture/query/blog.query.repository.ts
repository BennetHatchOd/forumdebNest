import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../../dto/view/blog.view.dto';
import { Blog, BlogDocument, BlogModelType } from '../../domain/blog.entity';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetBlogQueryParams } from '../../dto/input/get.blog.query.params.input.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';

@Injectable()
export class BlogQueryRepository {

    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType, 
    ){}
    
    async  findById(id: string): Promise<BlogViewDto> {
        if (!Types.ObjectId.isValid(id)) 
            throw new NotFoundException('blog not found');
        
        const searchItem: BlogDocument | null = await this.BlogModel.findOne({
                                                    _id: new Types.ObjectId(id),
                                                    deletedAt: null
                                                });
        if(searchItem)
            return BlogViewDto.mapToView(searchItem);
        throw new NotFoundException('blog not found');
    }

    async findByIdWitoutCheck(id: string): Promise<BlogViewDto|null> {
        if (!Types.ObjectId.isValid(id))
            return null;

        const searchItem: BlogDocument | null = await this.BlogModel.findOne({
            _id: new Types.ObjectId(id),
            deletedAt: null
        });
        if(searchItem)
            return BlogViewDto.mapToView(searchItem);
        return null;
    }

    async find(queryReq: GetBlogQueryParams): Promise<PaginatedViewDto<BlogViewDto[]>> {


        const nameSearch = queryReq.searchNameTerm
            ? { name: { $regex: queryReq.searchNameTerm, $options: 'i' } }
            : {};
        const queryFilter: FilterQuery<Blog> = { ...nameSearch, deletedAt: null };
        const totalCount: number = await this.BlogModel.countDocuments(queryFilter);

        //if (totalCount == 0) return emptyPaginator;

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