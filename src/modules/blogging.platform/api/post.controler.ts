import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { URL_PATH } from '../../../core/setting';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view.dto';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostInputDto } from '../dto/input/post.input.dto';
import { GetCommentQueryParams } from '../dto/input/get.comment.query.params.input.dto';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentQueryRepository } from '../infrastucture/query/comment.query.repository';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { PostService } from '../apllication/post.service';

@Controller(URL_PATH.posts)
export class PostController {
    constructor(
        private postService: PostService,
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

//*
    @Get()
    async getAll(@Query() query: GetPostQueryParams,)
        : Promise<PaginatedViewDto<PostViewDto[]>> {

        const postPaginator: PaginatedViewDto<PostViewDto[]>
            = await this.postQueryRepository.find(query);
        return postPaginator;
    }

    @Get(':id')
    async getById(@Param('id') id: string):Promise<PostViewDto>{
        //
        // Returns post by id

        const foundPost: PostViewDto = await this.postQueryRepository.findByIdWithCheck(id);
        return foundPost;
    }

    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async correctPost(@Param('id') id: string, @Body() post: PostInputDto): Promise<void>{
        //
        // Update existing Post by id with InputModel

        return await this.postService.edit(id, post)

    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param('id') id: string): Promise<void>{
        //
        // Delete post specified by id

        return await this.postService.delete(id)

    }

    @Get('id/comments')
    async getCommentByPost(@Param('id') id: string,
                        @Query() query: GetCommentQueryParams)
        : Promise<PaginatedViewDto<CommentViewDto[]>> {
        //
        // Returns all comments for specified post

        query.setParentPostIdSearchParams(id)
        const commentPaginator: PaginatedViewDto<CommentViewDto[]>
            = await this.commentQueryRepository.find(query);
        return commentPaginator;

    }
}