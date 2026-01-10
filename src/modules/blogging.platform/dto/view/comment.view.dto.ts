// import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
// import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
// import { Comment } from '@modules/blogging.platform/domain/comment.entity';
//
// export class CommentViewDto {
//         public id: string;
//         public content: string;
//         public createdAt: string;
//         public commentatorInfo: {
//             userId: string,
//             userLogin: string,
//         }
//         public likesInfo:  {
//             likesCount: number,
//             dislikesCount: number,
//             myStatus: Rating,
//         };
//
//     constructor(item: Comment, likeInfo: LikesInfoViewDto) {
//         this.id = item.id.toString();
//         this.content = item.content;
//         this.createdAt = item.createdAt.toISOString();
//         this.commentatorInfo = {
//             userId: item.commentatorInfo.userId,
//             userLogin: item.commentatorInfo.userLogin,
//         };
//         this.likesInfo =  {
//             likesCount: likeInfo.likesCount,
//             dislikesCount: likeInfo.dislikesCount,
//             myStatus: likeInfo.myStatus,
//         }
//     }
//
//      public static mapToView(item: Comment, likeInfo: LikesInfoViewDto): CommentViewDto {
//         return new CommentViewDto(item, likeInfo)
//     }
// }
//
