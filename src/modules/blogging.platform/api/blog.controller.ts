import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';
import { BlogViewDto } from '../dto/view/blog.view.dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetBlogQueryParams } from '../dto/input/get.blog.query.params.input.dto';
import { BlogInputDto } from '../dto/input/blog.input.dto';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostInputDto } from '../dto/input/post.input.dto';
import { PostByBlogInputDto } from '../dto/input/post.by.blog.input.dto';
import { PostService } from '../application/post.service';
import { URL_PATH } from '../../../core/url.path.setting';
import { IdInputDto } from '../../../core/dto/input/id.Input.Dto';

@Controller(URL_PATH.blogs)
export class BlogController {
    constructor(
        private blogService: BlogService,
        private postService: PostService,
        private blogQueryRepository: BlogQueryRepository,
        private postQueryRepository: PostQueryRepository,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBlog(@Body() blog: BlogInputDto): Promise<BlogViewDto> {
        //
        // Create new blog

        const createId: string = await this.blogService.create(blog);
        const blogView: BlogViewDto =
            await this.blogQueryRepository.findByIdWithCheck(createId);
        return blogView;
    }

    @Get()
    async getAll(
        @Query() query: GetBlogQueryParams,
    ): Promise<PaginatedViewDto<BlogViewDto[]>> {
        const blogPaginator: PaginatedViewDto<BlogViewDto[]> =
            await this.blogQueryRepository.find(query);

        return blogPaginator;
    }

    @Get(':id')
    async getById(@Param('id') inputId: IdInputDto): Promise<BlogViewDto> {
        //
        // Returns blog by id

        const foundBlog: BlogViewDto =
            await this.blogQueryRepository.findByIdWithCheck(inputId.id);
        return foundBlog;
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async correctBlog(
        @Param('id') inputId: IdInputDto,
        @Body() blog: BlogInputDto,
    ): Promise<void> {
        //
        // Update existing Blog by id with InputModel

        return await this.blogService.edit(inputId.id, blog);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') inputId: IdInputDto, ): Promise<void> {
        //
        // Delete blog specified by id

        return await this.blogService.delete(inputId.id);
    }

    @Get(':id/posts')
    // async getPostByBlog(@Param('id') id: string,
    async getPostByBlog(
        @Param('id') inputId: IdInputDto,
        @Query() query: GetPostQueryParams,
    ): Promise<PaginatedViewDto<PostViewDto[]>> {
        //
        // Returns all posts for specified blog
        query.setBlogIdSearchParams(inputId.id);
        // проверка существования блога
        await this.blogQueryRepository.findByIdWithCheck(inputId.id);

        const postPaginator: PaginatedViewDto<PostViewDto[]> =
            await this.postQueryRepository.find(query);
        return postPaginator;
    }

    @Post(':id/posts')
    @HttpCode(HttpStatus.CREATED)
    async createPostByBlog(
        @Param('id') inputId: IdInputDto,
        @Body() createPartDto: PostByBlogInputDto,
    ): Promise<PostViewDto> {
        // Create new post for specific blog
        const createDto: PostInputDto = { ...createPartDto, blogId: inputId.id };
        const createId: string = await this.postService.create(createDto);
        const postView: PostViewDto =
            await this.postQueryRepository.findByIdWithCheck(createId);
        return postView;
    }
}

