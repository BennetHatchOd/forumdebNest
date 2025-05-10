import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentQueryRepository } from '../infrastucture/query/comment.query.repository';
import { URL_PATH } from '@core/url.path.setting';
import { IdInputDto } from '@core/dto/input/id.Input.Dto';
import { CurrentUserId } from '@core/decorators/current.user';
import { AuthGuard } from '@nestjs/passport';
import { LikeInputDto } from '@modules/blogging.platform/dto/input/like.input.dto';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { CommandBus } from '@nestjs/cqrs';
import { MakeLikeCommand } from '@modules/blogging.platform/application/UseCase/make.like.usecase';
import { LikeTarget } from '@modules/blogging.platform/dto/like.target.enum';

// @UseGuards(AuthGuard('jwt'))
// @CurrentUserId() userId: string,
@Controller(URL_PATH.comments)
export class CommentController {
    constructor(
        private commandBus: CommandBus,
        private commentQueryRepository: CommentQueryRepository,
    ) {}

    @Get(':id')
    async getById(@Param('id') inputId: IdInputDto): Promise<CommentViewDto> {
        //
        // Returns comment by id

        const foundComment: CommentViewDto =
            await this.commentQueryRepository.findByIdWithCheck(inputId.id);
        return foundComment;
    }

    @Put(':id/like-status')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard('jwt'))
    async setLikeStatus(
        @CurrentUserId() user: string,
        @Param() { id }: IdInputDto,
        @Body() likeStatus: LikeInputDto,
    ) {
        const createLike: LikeCreateDto = {
            targetId: id,
            ownerId: user,
            rating: likeStatus.rating,
            targetType: LikeTarget.Comment,
        };
        await this.commandBus.execute(new MakeLikeCommand(createLike));
    }

    // @Put(':id')
    // @UseGuards(AuthGuard('jwt'))
    // async d(@CurrentUserId() userId: string,)

    // @Delete(':id')
    // @UseGuards(AuthGuard('jwt'))
    // async sd(@CurrentUserId() userId: string,)
}