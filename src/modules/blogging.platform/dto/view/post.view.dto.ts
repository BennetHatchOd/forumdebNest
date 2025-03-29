import { PostDocument } from '../../domain/post.entity';
import { Rating } from '../../../../core/Rating.enum';

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
        newestLikes: string[]//NewestLikesDTO;
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
            likesCount: item.likesCount,
            dislikesCount: item.dislikesCount,
            myStatus: likeStatus,
            newestLikes: [] //new NewestLikesDTO(item.extendedLikesInfo.newestLikes),
        }
    }

    static   mapToView(item: PostDocument, likeStatus: Rating):PostViewDto {
        return  new PostViewDto(item, likeStatus);
    }
}




