import { Injectable } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../../domain/comment.entity';
import { CommentViewDto } from '../../dto/view/comment.view.dto';
import { Rating } from '../../dto/enum/rating.enum';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { Like, LikeModelType } from '@modules/blogging.platform/domain/like.entity';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { LikesQueryRepositories } from '@modules/blogging.platform/infrastucture/query/likes.query.repositories';
import { GetCommentQueryParams } from '@modules/blogging.platform/dto/input/get.comment.query.params.input.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { LikesDescriptionManyDto } from '@modules/blogging.platform/dto/likes.description.many.dto';
import { EmptyPaginator } from '@core/dto/empty.paginator';

@Injectable()
export class CommentQueryRepository {
    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
        private likesQueryRepository: LikesQueryRepositories,
    ) {}

    async findByIdWithCheck(
        id: string,
        userId: string | null = null,
    ): Promise<CommentViewDto> {
        // returns a comment by id, if comment isn't found throws an exception

        const searchItem: CommentDocument | null =
            await this.CommentModel.findOne({
                _id: new Types.ObjectId(id),
                deletedAt: null,
            });
        if (!searchItem)
            throw new DomainException({
                message: 'comment not found',
                code: DomainExceptionCode.NotFound,
            });

        const likesInfo: LikesInfoViewDto
            = await this.likesQueryRepository.findOneLikeInfo({
                targetId: id,
                ownerId: userId,
                targetType: LikeTarget.Comment})

        return CommentViewDto.mapToView(searchItem, likesInfo);
    }

    async find(
        queryReq: GetCommentQueryParams,
        userId: string | null = null,
    ): Promise<PaginatedViewDto<CommentViewDto>> {
        // получаем список всех комментариев, принадлежащих посту, Id которого
        // приходит в query запросе и находится в queryReq.searchParentPostId

        const parentPostIdSearch = queryReq.searchParentPostId
            ? { parentPostId: { $regex: queryReq.searchParentPostId, $options: 'i' } }
            : {};
        const queryFilter: FilterQuery<Comment> = {
            ...parentPostIdSearch,
            deletedAt: null,
        };
        const totalCount: number =
            await this.CommentModel.countDocuments(queryFilter);

        if(totalCount === 0)
            return new EmptyPaginator<CommentViewDto>();

        const comments: CommentDocument[] = await this.CommentModel.find(
            queryFilter,)
            .limit(queryReq.pageSize)
            .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
            .sort({ [queryReq.sortBy]: queryReq.sortDirection });

        const targetIds = comments.map((comment: CommentDocument) => comment._id.toString());
        const likesDescription: LikesDescriptionManyDto ={
            targetIds: targetIds,
            ownerId: userId,
            targetType: LikeTarget.Comment,
        }
        const likes: LikesInfoViewDto[] = await this.likesQueryRepository.findManyLikesInfo(likesDescription);

        return PaginatedViewDto.mapToView({
            items: this.mapCommentsView(comments, likes),
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount,
        });
    }

    private mapCommentsView(comments:CommentDocument[], likeInfo: LikesInfoViewDto[]){
        const commentView: CommentViewDto[] = comments.map((value, ind) =>
            (CommentViewDto.mapToView(value,likeInfo[ind])))

        return commentView;
    }
}