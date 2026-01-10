import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { GetPostQueryParams } from '../dto/input/get.post.query.params.input.dto';
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { URL_PATH } from '@core/url.path.setting';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { CurrentUserId } from '@core/decorators/current.user';
import { ReadUserIdGuard } from '@core/guards/read.userid';
import { CommandBus } from '@nestjs/cqrs';
import { convertToIdNumber } from '@core/infrastucture/convert.to.id.number';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Controller(URL_PATH.postsQuery)
export class PostQueryController {
    constructor(
        private postQueryRepository: PostQueryRepository,
        private commandBus: CommandBus,
       // private commentQueryRepository: CommentQueryRepository,
    ){}

    @Get()
    @UseGuards(ReadUserIdGuard)
    async getAll(
        @Query() query: GetPostQueryParams,
        @CurrentUserId() user: string,
    ): Promise<PaginatedViewDto<PostViewDto>> {

        query.setBlogIdSearchParams();
        const postPaginator: PaginatedViewDto<PostViewDto>
            = await this.postQueryRepository.find(query, user);
        return postPaginator;
    }

    @Get(':id')
    @UseGuards(ReadUserIdGuard)
    async getById(
        @Param('id') id: string,
        @CurrentUserId() user: number,
    ):Promise<PostViewDto>{
        //
        // Returns post by id

        const postId = convertToIdNumber(id);
        if (!postId)
            throw new DomainException({
                message: 'blog not found',
                code: DomainExceptionCode.NotFound,
            });
        const foundPost: PostViewDto
            = await this.postQueryRepository.findByIdWithCheck(postId, user);
        return foundPost;
    }


    // @Get(':id/comments')
    // @UseGuards(ReadUserIdGuard)
    // async getCommentsByPost(
    //     @CurrentUserId() user: string,
    //     @Param() {id}: IdInputDto,
    //     @Query() query: GetCommentQueryParams
    //  ): Promise<PaginatedViewDto<CommentViewDto>> {
    //     // Returns all comments for specified post, if the post isn't found,
    //     // return "not found"
    //
    //     await this.postQueryRepository.findByIdWithCheck(id, user)
    //     // check the existence of the post and throw the exception "not found"
    //
    //     query.setParentPostIdSearchParams(id)
    //     const commentPaginator: PaginatedViewDto<CommentViewDto>
    //          = await this.commentQueryRepository.find(query, user);
    //     return commentPaginator;
    //
    // }
    //


}