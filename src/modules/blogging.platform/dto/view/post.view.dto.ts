import { Rating } from '../enum/rating.enum';
import { PostRowViewDto } from '@modules/blogging.platform/dto/view/row/post.row.view.dto';

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

     public static mapToView(post: PostRowDto): PostViewDto {
        const view = new PostViewDto();

        view.id = post.id.toString();
        view.title = post.title;
        view.shortDescription = post.shortDescription;
        view.createdAt = post.createdAt.toISOString();
        view.content = post.content;
        view.blogId = post.blogId.toString();
        view.blogName = post.blogName;
        view.extendedLikesInfo = {
            likesCount: post.likesCount,
            dislikesCount: post.dislikesCount,
            myStatus: myStatus,
            newestLikes: likes
        }

        return  view;
    }
}




