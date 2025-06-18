import {
    Controller,
    Get,
    Param,
    Query, UseGuards,
} from '@nestjs/common';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';
import { BlogViewDto } from '../dto/view/blog.view.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetBlogQueryParams } from '../dto/input/get.blog.query.params.input.dto';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { URL_PATH } from '@core/url.path.setting';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { CurrentUserId } from '@core/decorators/current.user';
import { ReadUserIdGuard } from '@core/guards/read.userid';
import { convertToId } from '@core/infrastucture/is.id';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Controller(URL_PATH.blogsQuery)
export class BlogQueryController {
    constructor(
        private blogQueryRepository: BlogQueryRepository,
        private postQueryRepository: PostQueryRepository,
    ) {}

    @Get()
    async getAll(
        @Query() query: GetBlogQueryParams,
    ): Promise<PaginatedViewDto<BlogViewDto>> {

        const blogPaginator: PaginatedViewDto<BlogViewDto> =
            await this.blogQueryRepository.find(query);

        return blogPaginator;
    }

    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogViewDto> {
        //
        // Returns blog by id

        const blogId = convertToId(id);
        if (!blogId)
            throw new DomainException({
                message: 'blog not found',
                code: DomainExceptionCode.NotFound,
            });
        const foundBlog: BlogViewDto =
            await this.blogQueryRepository.findById(blogId);
        return foundBlog;
    }


    @Get(':id/posts')
    @UseGuards(ReadUserIdGuard)
    async getPostByBlog(
        @CurrentUserId() user: string,
        @Param('id') id: string,
        @Query() query: GetPostQueryParams,
    ): Promise<PaginatedViewDto<PostViewDto>> {
        //
        // Returns all posts for specified blog
        const blogId = convertToId(id);
        if (!blogId)
            throw new DomainException({
                message: 'blog not found',
                code: DomainExceptionCode.NotFound,
            });
        query.setBlogIdSearchParams(blogId);

        const postPaginator: PaginatedViewDto<PostViewDto> =
            await this.postQueryRepository.find(query, user);
        return postPaginator;
    }

}

