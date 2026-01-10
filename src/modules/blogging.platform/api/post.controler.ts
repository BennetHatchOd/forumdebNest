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
import { PostViewDto } from '../dto/view/post.view.dto';
import { PostInputDto } from '../dto/input/post.input.dto';
import { PostQueryRepository } from '../infrastucture/query/post.query.repository';
import { URL_PATH } from '@core/url.path.setting';
import { CurrentUserId } from '@core/decorators/current.user';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '@modules/blogging.platform/application/UseCase/post/create.post.usecase';
import { EditPostCommand } from '@modules/blogging.platform/application/UseCase/post/edit.post.usecase';
import { DeletePostCommand } from '@modules/blogging.platform/application/UseCase/post/delete.post.usecase';
import { convertToIdNumber } from '@core/infrastucture/convert.to.id.number';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
//import { CommentInputDto } from '@modules/blogging.platform/dto/input/comment.input.dto';
//import { CommentViewDto } from '@modules/blogging.platform/dto/view/comment.view.dto';
//import { CreateCommentCommand } from '@modules/blogging.platform/application/UseCase/comment/create.comment.usecase';
//import { CommentQueryRepository } from '@modules/blogging.platform/infrastucture/query/comment.query.repository';

@Controller(URL_PATH.posts)
export class PostController {
    constructor(
        private postQueryRepository: PostQueryRepository,
        private commandBus: CommandBus,
        //private commentQueryRepository: CommentQueryRepository,
    ){}

    @Post()
    @UseGuards(AuthGuard('basic'))
    @HttpCode(HttpStatus.CREATED)
    async createPost(
        @Body() postDto: PostInputDto,
        @CurrentUserId() user: number):Promise<PostViewDto> {
        //
        // Create new post

        const createdId: number
            = await this.commandBus.execute(new CreatePostCommand(postDto));
        const postView: PostViewDto
            = await this.postQueryRepository.findByIdWithCheck(createdId, user);
        return postView;
    }

    @Put(':id')
    @UseGuards(AuthGuard('basic'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async correctPost(
        @Param('id') id: string,
        @Body() postDto: PostInputDto
    ): Promise<void>{
        //
        // Update existing Post by id with InputModel

        const postId = convertToIdNumber(id);
        if (!postId)
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound,
            });
        return await this.commandBus.execute(new EditPostCommand(postId, postDto));
    }

    // @Put(':id/like-status')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @UseGuards(AuthGuard('jwt'))
    // async setLikeStatus(
    //     @CurrentUserId() user: string,
    //     @Param() {id}: IdInputDto,
    //     @Body() likeStatus: LikeInputDto,
    // ) {
    //
    //     const createLike: LikeCreateDto = {
    //         targetId: id,
    //         ownerId: user,
    //         rating: likeStatus.likeStatus,
    //         targetType: LikeTarget.Post,
    //     };
    //
    //     await this.commandBus.execute(new MakeLikeCommand(createLike));
    // }

    @Delete(':id')
    @UseGuards(AuthGuard('basic'))
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(
        @Param('id') id: string,
    ): Promise<void>{
        //
        // Delete post specified by id

        const postId = convertToIdNumber(id);
        if (!postId)
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound,
            });
        return await this.commandBus.execute(new DeletePostCommand(postId))

    }


    // @Post(':id/comments')
    // @UseGuards(AuthGuard('jwt'))
    // async createCommentByPost(
    //     @CurrentUserId() user: number,
    //     @Param('id') id: string,
    //     @Body() comment: CommentInputDto
    // ): Promise<CommentViewDto> {
    //     // Create comment for specified post, if the post isn't found,
    //     // throw the exception "not found"
    //
    //     const numericId = convertToId(id);
    //     if(!numericId)
    //         throw new DomainException({
    //             message: "post not found",
    //             code: DomainExceptionCode.NotFound,
    //         });
    //
    //     // check the existence of the post
    //
    //     const createdComment: number = await this.commandBus.execute(new CreateCommentCommand(numericId, comment, user));
    //     return this.commentQueryRepository.findById(createdComment, user);
    //
    // }

}