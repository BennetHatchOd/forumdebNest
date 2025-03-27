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
import { BlogService } from '../apllication/blog.service';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';
import { URL_PATH } from 'src/core/setting';
import { BlogViewDto } from '../dto/view/blog.view.dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetBlogQueryParams } from '../dto/input/get.blog.query.params.input.dto';
import { BlogInputDto } from '../dto/input/blog.input.dto';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostInputDto } from '../dto/input/post.input.dto';
import { PostByBlogInputType } from '../dto/input/post.by.blog.input.dto';
import { PostService } from '../apllication/post.service';

@Controller(URL_PATH.blogs)
export class BlogControllers {
    constructor(
        private blogService: BlogService,
        private postService: PostService,
        private blogQueryRepository: BlogQueryRepository,
        private postQueryRepository: PostQueryRepository,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBlog(@Body() blog: BlogInputDto):Promise<BlogViewDto> {
    // 
    // Create new blog

        const createId: string = await this.blogService.create(blog);
        const blogView: BlogViewDto = await this.blogQueryRepository.findByIdWithCheck(createId);
        return blogView;
    }

    @Get()
    async getAll(@Query() query: GetBlogQueryParams,)
        : Promise<PaginatedViewDto<BlogViewDto[]>> {

        const blogPaginator: PaginatedViewDto<BlogViewDto[]>
            = await this.blogQueryRepository.find(query);

        return blogPaginator;

    }

    @Get(':id')
    async getById(@Param('id') id: string):Promise<BlogViewDto>{
    // 
    // Returns blog by id
        
        const foundBlog: BlogViewDto = await this.blogQueryRepository.findByIdWithCheck(id);
        return foundBlog;
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async correctBlog(@Param('id') id: string, @Body() blog: BlogInputDto): Promise<void>{
    // 
    // Update existing Blog by id with InputModel
        
        return await this.blogService.edit(id, blog)
        
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string): Promise<void>{
    //
    // Delete blog specified by id
        
        return await this.blogService.delete(id)
            
    }

    @Get(':id/posts')
    async getPostByBlog(@Param('id') id: string,
                        @Query() query: GetPostQueryParams)
        : Promise<PaginatedViewDto<PostViewDto[]>> {
    //
    // Returns all posts for specified blog
        query.setBlogIdSearchParams(id)
        const postPaginator: PaginatedViewDto<PostViewDto[]>
            = await this.postQueryRepository.find(query);
        return postPaginator;

    }

    @Post(':id/posts')
    @HttpCode(HttpStatus.CREATED)
    async createPostByBlog(@Param('id') id: string, @Body() createPartDto:PostByBlogInputType)
        : Promise<PostViewDto>{
    // Create new post for specific blog
        const createDto: PostInputDto = {...createPartDto,
                                            blogId: id};
        const createId: string = await this.postService.create(createDto);
        const postView: PostViewDto = await this.postQueryRepository.findByIdWithCheck(createId);
        return postView;
    }
}