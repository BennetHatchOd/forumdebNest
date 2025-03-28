import { PostDocument } from '../../domain/post.entity';
import { Rating } from '../../../../core/Rating.enum';
import { LikeDetailsView, NewestLikesDTO } from './newest.likes.dto';

export class PostViewDto {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    createdAt: string;
    blogId: string;
    blogName: string;
    extendedLikesInfo:{
        likesCount: number
        dislikesCount: number;
        myStatus: Rating;
        newestLikes: NewestLikesDTO;
    }

    constructor(item: PostDocument, likeStatus: Rating) {
        this.id = item._id.toString();
        this.title = item.title;
        this.shortDescription = item.shortDescription;
        this.createdAt = item.createdAt.toISOString();
        this.content = item.content;
        this.blogId = item.blogId;
        this.blogName = item.blogName;
        this.extendedLikesInfo = {
            likesCount: item.extendedLikesInfo.likesCount,
            dislikesCount: item.extendedLikesInfo.dislikesCount,
            myStatus: likeStatus,
            newestLikes: new NewestLikesDTO(item.extendedLikesInfo.newestLikes),
        }
    }

    static   mapToView(item: PostDocument, likeStatus: Rating):PostViewDto {
        return  new PostViewDto(item, likeStatus);
    }
}




