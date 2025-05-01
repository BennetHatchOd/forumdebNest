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
    UseGuards,
} from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostInputDto } from '../dto/input/post.input.dto';
import { GetCommentQueryParams } from '../dto/input/get.comment.query.params.input.dto';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentQueryRepository } from '../infrastucture/query/comment.query.repository';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { PostService } from '../application/post.service';
import { URL_PATH } from '../../../core/url.path.setting';
import { IdInputDto } from '../../../core/dto/input/id.Input.Dto';
import { CommentInputDto } from '../dto/input/comment.input.dto';
import { CommentService } from '../application/comment.service';
import { CurrentUserId } from '../../../core/decorators/current.user';
import { AuthGuard } from '@nestjs/passport';

@Controller(URL_PATH.posts)
export class PostController {
    constructor(
        private postService: PostService,
        private commentService: CommentService,
        private postQueryRepository: PostQueryRepository,
        private commentQueryRepository: CommentQueryRepository,
    ){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPost(@Body() postDto: PostInputDto):Promise<PostViewDto> {
        //
        // Create new post

        const createdId: string = await this.postService.create(postDto);
        const postView: PostViewDto = await this.postQueryRepository.findByIdWithCheck(createdId);
        return postView;
    }

    @Get()
    async getAll(@Query() query: GetPostQueryParams,)
        : Promise<PaginatedViewDto<PostViewDto[]>> {

        const postPaginator: PaginatedViewDto<PostViewDto[]>
            = await this.postQueryRepository.find(query);
        return postPaginator;
    }

    @Get(':id')
    async getById(@Param('id') inputId: IdInputDto):Promise<PostViewDto>{
        //
        // Returns post by id

        const foundPost: PostViewDto = await this.postQueryRepository.findByIdWithCheck(inputId.id);
        return foundPost;
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async correctPost(
        @Param('id') inputId: IdInputDto,
        @Body() post: PostInputDto
    ): Promise<void>{
        //
        // Update existing Post by id with InputModel

        return await this.postService.edit(inputId.id, post)

    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param('id') inputId: IdInputDto): Promise<void>{
        //
        // Delete post specified by id

        return await this.postService.delete(inputId.id)

    }

    @Get(':id/comments')
    async getCommentByPost(
        @Param('id') postId: IdInputDto,
        @Query() query: GetCommentQueryParams
    ): Promise<PaginatedViewDto<CommentViewDto[]>> {
        // Returns all comments for specified post, if the post isn't found,
        // throw the exception "not found"

        await this.postQueryRepository.findByIdWithCheck(postId.id)
        // check the existence of the post and throw the exception "not found"

        query.setParentPostIdSearchParams(postId.id)
        const commentPaginator: PaginatedViewDto<CommentViewDto[]>
            = await this.commentQueryRepository.find(query);
        return commentPaginator;

    }

    @Post(':id/comments')
    @UseGuards(AuthGuard('jwt'))
    async createCommentByPost(
        @CurrentUserId() currentUserId: string,
        @Param('id') postId: IdInputDto,
        @Body() comment: CommentInputDto
    ): Promise<CommentViewDto> {
        // Create comment for specified post, if the post isn't found,
        // throw the exception "not found"

        await this.postQueryRepository.findByIdWithCheck(postId.id)
        // check the existence of the post

        const createdComment: string = await this.commentService.create(postId.id, comment, "currentUserId");
        return this.commentQueryRepository.findByIdWithCheck(createdComment);

    }

}