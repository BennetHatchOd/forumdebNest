import { PostDocument } from '../../domain/post.entity';
import { Rating } from '../enum/rating.enum';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { NewestLikesDto } from '@modules/blogging.platform/dto/view/newest.likes';

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
        newestLikes: {
            addedAt: string,
            userId: string,
            login: string
        }[];
    }

    constructor(post: PostDocument,
                likeInfo: LikesInfoViewDto,
                newestLikes: NewestLikesDto
    ) {
        this.id = post._id.toString();
        this.title = post.title;
        this.shortDescription = post.shortDescription;
        this.createdAt = post.createdAt.toISOString();
        this.content = post.content;
        this.blogId = post.blogId;
        this.blogName = post.blogName;
        this.extendedLikesInfo = {
            likesCount: likeInfo.likesCount,
            dislikesCount: likeInfo.dislikesCount,
            myStatus: likeInfo.myStatus,
            newestLikes: newestLikes.newestLikes
        }
    }

    public static mapToView(post: PostDocument,
                       likeInfo: LikesInfoViewDto,
                       newestLikes: NewestLikesDto
    ):PostViewDto {
        return  new PostViewDto(post, likeInfo, newestLikes);
    }
}




