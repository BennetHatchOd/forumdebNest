import { PostDocument } from '../../domain/post.entity';
import { Rating } from '../rating.enum';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';

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

    constructor(item: PostDocument,
    //            likeInfo: extendedLikesInfoViewDto
    ) {
        this.id = item._id.toString();
        this.title = item.title;
        this.shortDescription = item.shortDescription;
        this.createdAt = item.createdAt.toISOString();
        this.content = item.content;
        this.blogId = item.blogId;
        this.blogName = item.blogName;
        this.extendedLikesInfo = {
            likesCount: 0,          //likeInfo.likesCount,
            dislikesCount: 0,       //likeInfo.dislikesCount,
            myStatus: Rating.None,  //likeInfo.myStatus,
            newestLikes: []         //[...likeInfo.NewestLike]
        }
    }

    static   mapToView(item: PostDocument,
    //                   likeInfo: extendedLikesInfoViewDto
    ):PostViewDto {
        return  new PostViewDto(item)//, likeInfo);
    }
}




