import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../../domain/comment.entity';
import { CommentViewDto } from '../../dto/view/comment.view.dto';
import { Rating } from '../../dto/rating.enum';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { Like, LikeModelType } from '@modules/blogging.platform/domain/like.entity';
import { LikeTarget } from '@modules/blogging.platform/dto/like.target.enum';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { LikesQueryRepositories } from '@modules/blogging.platform/infrastucture/query/likes.query.repositories';

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

        if (!Types.ObjectId.isValid(id))
            throw new DomainException({
                message: 'comment not found',
                code: DomainExceptionCode.NotFound,
            });

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
            = await this.likesQueryRepository.findLikeInfo({
                targetId: id,
                ownerId: userId,
                targetType: LikeTarget.Comment})

        return CommentViewDto.mapToView(searchItem, likesInfo);
    }

    // async find(
    //     queryReq: GetCommentQueryParams,
    //     userId: string | null = null,
    // ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    //     const parentPostIdSearch = queryReq.searchParentPostId
    //         ? { name: { $regex: queryReq.searchParentPostId, $options: 'i' } }
    //         : {};
    //     const queryFilter: FilterQuery<Comment> = {
    //         ...parentPostIdSearch,
    //         deletedAt: null,
    //     };
    //     const totalCount: number =
    //         await this.CommentModel.countDocuments(queryFilter);
    //
    //     const comments: CommentDocument[] = await this.CommentModel.find(
    //         queryFilter,
    //     )
    //         .limit(queryReq.pageSize)
    //         .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
    //         .sort({ [queryReq.sortBy]: queryReq.sortDirection });
    //
    //     let likeStatus: Rating;
    //     if (!userId) likeStatus = Rating.None;
    //
    //     const items: CommentViewDto[] = comments.map((item) =>
    //         CommentViewDto.mapToView(item, likeStatus),
    //     );
    //
    //     return PaginatedViewDto.mapToView({
    //         items: items,
    //         page: queryReq.pageNumber,
    //         size: queryReq.pageSize,
    //         totalCount: totalCount,
    //     });
    // }
}