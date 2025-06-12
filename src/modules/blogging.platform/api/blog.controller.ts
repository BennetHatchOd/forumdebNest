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
    Query, UseGuards,
} from '@nestjs/common';
import { BlogQueryRepository } from '../infrastucture/query/blog.query.repository';
import { BlogViewDto } from '../dto/view/blog.view.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetBlogQueryParams } from '../dto/input/get.blog.query.params.input.dto';
import { BlogInputDto } from '../dto/input/blog.input.dto';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostInputDto } from '../dto/input/post.input.dto';
import { PostByBlogInputDto } from '../dto/input/post.by.blog.input.dto';
import { URL_PATH } from '@core/url.path.setting';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { CurrentUserId } from '@core/decorators/current.user';
import { AuthGuard } from '@nestjs/passport';
import { ReadUserIdGuard } from '@core/guards/read.userid';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '@modules/blogging.platform/application/UseCase/blog/create.blog.usecase';
import { EditBlogCommand } from '@modules/blogging.platform/application/UseCase/blog/edit.blog.usecase';
import { BlogEditDto } from '@modules/blogging.platform/dto/edit/blog.edit.dto';
import { DeleteBlogCommand } from '@modules/blogging.platform/application/UseCase/blog/delete.blog.usecase';
import { CreatePostCommand } from '@modules/blogging.platform/application/UseCase/post/create.post.usecase';



@Controller(URL_PATH.blogs)
export class BlogController {
    constructor(
        private commandBus: CommandBus,
        private blogQueryRepository: BlogQueryRepository,
        private postQueryRepository: PostQueryRepository,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('basic'))
    async createBlog(
        @Body() blog: BlogInputDto): Promise<BlogViewDto> {
        //
        // Create new blog

        const createId: number = await this.commandBus.execute(new CreateBlogCommand(blog));
        const blogView: BlogViewDto =
            await this.blogQueryRepository.findByIdWithCheck(createId);
        return blogView;
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard('basic'))
    async correctBlog(
        @Param() {id}: IdInputDto,
        @Body() blog: BlogInputDto,
    ): Promise<void> {
        //
        // Update existing Blog by id with InputModel
        const blogDto: BlogEditDto = {...blog, id: id}
        return await this.commandBus.execute(new EditBlogCommand(blogDto));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard('basic'))
    async deleteBlog(
        @Param() {id}: IdInputDto, ): Promise<void> {
        //
        // Delete blog specified by id

        return await this.commandBus.execute(new DeleteBlogCommand(id));
    }

    @Post(':id/posts')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('basic'))
    async createPostByBlog(
        @CurrentUserId() user: number,
        @Param() {id}: IdInputDto,
        @Body() createPartDto: PostByBlogInputDto,
    ): Promise<PostViewDto> {
        // Create new post for specific blog
        const createDto: PostInputDto = { ...createPartDto, blogId: id };
        const createId: number = await this.commandBus.execute(new CreatePostCommand(createDto));
        const postView: PostViewDto =
            await this.postQueryRepository.findByIdWithCheck(createId, user);
        return postView;
    }
}

