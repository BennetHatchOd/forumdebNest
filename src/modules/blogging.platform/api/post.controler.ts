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
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostInputDto } from '../dto/input/post.input.dto';
import { GetCommentQueryParams } from '../dto/input/get.comment.query.params.input.dto';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentQueryRepository } from '../infrastucture/query/comment.query.repository';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { PostService } from '../application/post.service';
import { URL_PATH } from '@core/url.path.setting';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { CommentInputDto } from '../dto/input/comment.input.dto';
import { CommentService } from '../application/comment.service';
import { CurrentUserId } from '@core/decorators/current.user';
import { AuthGuard } from '@nestjs/passport';
import { ReadUserIdGuard } from '@core/guards/read.userid';
import { LikeInputDto } from '@modules/blogging.platform/dto/input/like.input.dto';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';
import { MakeLikeCommand } from '@modules/blogging.platform/application/UseCase/make.like.usecase';
import { CommandBus } from '@nestjs/cqrs';

@Controller(URL_PATH.posts)
export class PostController {
    constructor(
        private postService: PostService,
        private commentService: CommentService,
        private postQueryRepository: PostQueryRepository,
        private commandBus: CommandBus,
        private commentQueryRepository: CommentQueryRepository,
    ){}

    @Post()
    @UseGuards(AuthGuard('basic'))
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @Body() postDto: PostInputDto,
        @CurrentUserId() user: string,):Promise<PostViewDto> {
        //
        // Create new post

        const createdId: string = await this.postService.create(postDto);
        const postView: PostViewDto = await this.postQueryRepository.findByIdWithCheck(createdId, user);
        return postView;
    }

    @Put(':id')
    @UseGuards(AuthGuard('basic'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async correctPost(
        @Param() {id}: IdInputDto,
        @Body() post: PostInputDto
    ): Promise<void>{
        //
        // Update existing Post by id with InputModel

        return await this.postService.edit(id, post)

    }

    @Put(':id/like-status')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard('jwt'))
    async setLikeStatus(
        @CurrentUserId() user: string,
        @Param() {id}: IdInputDto,
        @Body() likeStatus: LikeInputDto,
    ) {

        const createLike: LikeCreateDto = {
            targetId: id,
            ownerId: user,
            rating: likeStatus.likeStatus,
            targetType: LikeTarget.Post,
        };

        await this.commandBus.execute(new MakeLikeCommand(createLike));
    }


    @Get()
    @UseGuards(ReadUserIdGuard)
    async getAll(
        @Query() query: GetPostQueryParams,
        @CurrentUserId() user: string,
    ): Promise<PaginatedViewDto<PostViewDto>> {

        const postPaginator: PaginatedViewDto<PostViewDto>
            = await this.postQueryRepository.find(query, user);
        return postPaginator;
    }

    @Get(':id')
    @UseGuards(ReadUserIdGuard)
    async getById(
        @Param() {id}: IdInputDto,
        @CurrentUserId() user: string,
    ):Promise<PostViewDto>{
        //
        // Returns post by id

        const foundPost: PostViewDto = await this.postQueryRepository.findByIdWithCheck(id, user);
        return foundPost;
    }

    @Delete(':id')
    @UseGuards(AuthGuard('basic'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(
        @Param() {id}: IdInputDto,
        @CurrentUserId() user: string,
    ): Promise<void>{
        //
        // Delete post specified by id

        return await this.postService.delete(id)

    }

    @Get(':id/comments')
    @UseGuards(ReadUserIdGuard)
    async getCommentsByPost(
        @CurrentUserId() user: string,
        @Param() {id}: IdInputDto,
        @Query() query: GetCommentQueryParams
     ): Promise<PaginatedViewDto<CommentViewDto>> {
        // Returns all comments for specified post, if the post isn't found,
        // return "not found"

        await this.postQueryRepository.findByIdWithCheck(id, user)
        // check the existence of the post and throw the exception "not found"

        query.setParentPostIdSearchParams(id)
        const commentPaginator: PaginatedViewDto<CommentViewDto>
             = await this.commentQueryRepository.find(query, user);
        return commentPaginator;

    }

    @Post(':id/comments')
    @UseGuards(AuthGuard('jwt'))
    async createCommentByPost(
        @CurrentUserId() user: string,
        @Param() {id}: IdInputDto,
        @Body() comment: CommentInputDto
    ): Promise<CommentViewDto> {
        // Create comment for specified post, if the post isn't found,
        // throw the exception "not found"

        await this.postQueryRepository.findByIdWithCheck(id, user)
        // check the existence of the post

        const createdComment: string = await this.commentService.create(id, comment, user);
        return this.commentQueryRepository.findByIdWithCheck(createdComment, user);

    }

}