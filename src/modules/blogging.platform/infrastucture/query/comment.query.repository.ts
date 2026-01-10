// import { Inject, Injectable } from '@nestjs/common';
// import { DATA_SOURCE } from '@core/constans/data.source';
// import { DataSource } from 'typeorm';
//
// @Injectable()
// export class CommentQueryRepository {
//     constructor(
//         @Inject(DATA_SOURCE) private dataSource: DataSource,
//         //private likesQueryRepository: LikesQueryRepositories,
//     ) {}
//
//     async findById(
//         commebtId: number,
//         userId: number | null = null,
//     ): Promise<CommentViewDto> {
//         // returns a comment by id, if comment isn't found throws an exception
//
//        const searchItem: Comment | null =
//             await this.CommentModel.findOne({
//                 _id: new Types.ObjectId(commebtId),
//                 deletedAt: null,
//             });
//         if (!searchItem)
//             throw new DomainException({
//                 message: 'comment not found',
//                 code: DomainExceptionCode.NotFound,
//             });
//
//         const likesInfo: LikesInfoViewDto
//             = await this.likesQueryRepository.findOneLikeInfo({
//                 targetId: commebtId,
//                 ownerId: userId,
//                 targetType: LikeTarget.Comment})
//
//         return CommentViewDto.mapToView(searchItem, likesInfo);
//     }
//
// //     async find(
// //         queryReq: GetCommentQueryParams,
// //         userId: string | null = null,
// //     ): Promise<PaginatedViewDto<CommentViewDto>> {
// //         // получаем список всех комментариев, принадлежащих посту, Id которого
// //         // приходит в query запросе и находится в queryReq.searchParentPostId
// //
// //         const parentPostIdSearch = queryReq.searchParentPostId
// //             ? { parentPostId: { $regex: queryReq.searchParentPostId, $options: 'i' } }
// //             : {};
// //         const queryFilter: FilterQuery<Comment> = {
// //             ...parentPostIdSearch,
// //             deletedAt: null,
// //         };
// //         const totalCount: number =
// //             await this.CommentModel.countDocuments(queryFilter);
// //
// //         if(totalCount === 0)
// //             return new EmptyPaginator<CommentViewDto>();
// //
// //         const comments: CommentDocument[] = await this.CommentModel.find(
// //             queryFilter,)
// //             .limit(queryReq.pageSize)
// //             .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
// //             .sort({ [queryReq.sortBy]: queryReq.sortDirection });
// //
// //         const targetIds = comments.map((comment: CommentDocument) => comment._id.toString());
// //         const likesDescription: LikesDescriptionManyDto ={
// //             targetIds: targetIds,
// //             ownerId: userId,
// //             targetType: LikeTarget.Comment,
// //         }
// //         const likes: LikesInfoViewDto[] = await this.likesQueryRepository.findManyLikesInfo(likesDescription);
// //
// //         return PaginatedViewDto.mapToView({
// //             items: this.mapCommentsView(comments, likes),
// //             page: queryReq.pageNumber,
// //             size: queryReq.pageSize,
// //             totalCount: totalCount,
// //         });
// //     }
// //
// //     private mapCommentsView(comments:CommentDocument[], likeInfo: LikesInfoViewDto[]){
// //         const commentView: CommentViewDto[] = comments.map((value, ind) =>
// //             (CommentViewDto.mapToView(value,likeInfo[ind])))
// //
// //         return commentView;
// //     }
// }
// // SELECT
// //     c.id,
// //     c.content,
// //     c."userId",
// //     c."createdAt",
// //     u.login "userLogin",
// //     COUNT(*) FILTER (WHERE l.status = 'Like') "likeCount",
// //     COUNT(*) FILTER (WHERE l.status = 'Dislike') "dislikeCount",
// //     (SELECT status FROM l WHERE "commentId" = $1 AND "userId" = $2) "myStatus"
// // FROM comments c
// // JOIN users u ON u.id = c."userId"
// // LEFT JOIN like_comment l ON l."commentId" = c.id
// // WHERE c.id = $1
// // GROUP BY c.id, c."userId", c.content, c."createdAt", u.login;
//
