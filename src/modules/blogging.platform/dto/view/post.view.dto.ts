import { PostDocument } from '../../domain/post.entity';
import { Rating } from '../rating.enum';

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
            addedAt: string;
            userId: string;
            login: string;
        }[];
    }

    static   mapToView(item: PostDocument, likeStatus: Rating):PostViewDto {
        const mappedPost = new this()
        mappedPost.id = item._id.toString();
        mappedPost.title = item.title;
        mappedPost.shortDescription = item.shortDescription;
        mappedPost.createdAt = item.createdAt.toISOString();
        mappedPost.content = item.content;
        mappedPost.blogId = item.blogId;
        mappedPost.blogName = item.blogName;
        mappedPost.extendedLikesInfo = {
            likesCount: item.extendedLikesInfo.likesCount,
            dislikesCount: item.extendedLikesInfo.dislikesCount,
            myStatus: likeStatus,
            newestLikes: [],
        }
        for(let i in item.extendedLikesInfo.newestLikes)
            mappedPost.extendedLikesInfo.newestLikes.push({...item.extendedLikesInfo.newestLikes[i]})
        return mappedPost;
    }
}

type LikeDetailsView = {
    addedAt: string;
    userId: string;
    login: string;
}


