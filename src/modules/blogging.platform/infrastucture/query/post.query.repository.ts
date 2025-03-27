import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../dto/view/post.view.dto';
import { FilterQuery, Types } from 'mongoose';
import { GetPostQueryParams } from '../../dto/input/get.post.query.params.input.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { Rating } from '../../../../core/Rating.enum';

@Injectable()
export class PostQueryRepository {
    // constructor(private likeService: LikeService) {}
    constructor(
        @InjectModel(Post.name) private PostModel: PostModelType,
    ){}

    async  findByIdWithCheck(id: string, userId: string|null = null): Promise<PostViewDto> {
        // если пост не найден, выкидываем ошибку 404 в репозитории

        if (!Types.ObjectId.isValid(id))
            throw new NotFoundException('post not found');

        const searchItem: PostDocument | null
            = await this.PostModel.findOne({
                                            _id: new Types.ObjectId(id),
                                            deletedAt: null
                                        });
        if(!searchItem)
            throw new NotFoundException('post not found');

        // если юзер не авторизирован, то статус лайка отсутствует
        let likeStatus: Rating = Rating.None
        if(userId)
        {}
        return PostViewDto.mapToView(searchItem, likeStatus);
    }

    async find(queryReq: GetPostQueryParams, userId: string|null = null): Promise<PaginatedViewDto<PostViewDto[]>> {

        const blogIdSearch = queryReq.searchBlogId
            ? { name: { $regex: queryReq.searchBlogId, $options: 'i' } }
            : {};
        const queryFilter: FilterQuery<Post> = { ...blogIdSearch, deletedAt: null };
        const totalCount: number = await this.PostModel.countDocuments(queryFilter);

        const posts: PostDocument[] = await this.PostModel.find(queryFilter)
            .limit(queryReq.pageSize)
            .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
            .sort({ [queryReq.sortBy]: queryReq.sortDirection });

        // формируем массив ид всех постов
        // делаем запрос в базу, получаем для нашего пользователя, массив объектов
        // {postID, likeStatus, newestLikes} из него формируем массив items для
        // пагинатора
        // const postIds: string[] = posts.map(s => s._id.toString())
        //
        // const lastLikes: PostsLastLikesViewType[] = await this.likeService.getArrayLastLikes(postIds)
        //
        // if(!userId){
        //     const items = searchItem.map(post => { const newestLikes: Array<LastLikesViewType>
        //         = lastLikes.find(el => el.postId === post._id.toString())!.newestLikes
        //         return this.mapDbToView(post, Rating.None, newestLikes)})

        // если юзер не авторизирован, то статус лайка отсутствует
        let likeStatus: Rating
        if(!userId)
            likeStatus = Rating.None

        const items : PostViewDto[]
            = posts.map(item => PostViewDto.mapToView(item, likeStatus));

        return PaginatedViewDto.mapToView({
            items: items,
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount
        })
    }

    // async findById(
    //     entityId: string,
    //     userId: string | undefined,
    // ): Promise<PostViewType | null> {
    //     if (!ObjectId.isValid(entityId)) return null;
    //     const searchItem: PostDocument | null = await PostModel.findOne({
    //         _id: new ObjectId(entityId),
    //     });

    //     let likeStatus: Rating = Rating.None;
    //     if (userId)
    //         likeStatus =
    //             await this.likeService.getUserRatingForEntity<PostType>(
    //                 entityId,
    //                 userId,
    //                 LikePost,
    //             );

    //     const lastLikes: Array<LastLikesViewType> =
    //         await this.likeService.getLastLikes(entityId);

    //     return searchItem
    //         ? this.mapDbToView(searchItem, likeStatus, lastLikes)
    //         : null;
    // }

    // async find(
    //     queryReq: QueryType,
    //     userId: string | undefined,
    // ): Promise<PaginatorType<PostViewType>> {
    //     const bloqIdSearch = queryReq.blogId ? { blogId: queryReq.blogId } : {};
    //     const queryFilter = { ...bloqIdSearch };

    //     const totalCount: number = await PostModel.countDocuments(queryFilter);
    //     const pagesCount = Math.ceil(totalCount / queryReq.pageSize);

    //     if (totalCount == 0) return emptyPaginator;

    //     const query = PostModel.find(queryFilter)
    //         .limit(queryReq.pageSize)
    //         .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
    //         .sort({ [queryReq.sortBy]: queryReq.sortDirection });

    //     const searchItem: PostDocument[] = await query.exec();
    //     const postIds: string[] = searchItem.map((s) => s._id.toString());

    //     const lastLikes: Array<PostsLastLikesViewType> =
    //         await this.likeService.getArrayLastLikes(postIds);

    //     if (!userId) {
    //         const items = searchItem.map((post) => {
    //             const newestLikes: Array<LastLikesViewType> = lastLikes.find(
    //                 (el) => el.postId === post._id.toString(),
    //             )!.newestLikes;
    //             return this.mapDbToView(post, Rating.None, newestLikes);
    //         });
    //         return {
    //             pagesCount: pagesCount,
    //             page:
    //                 queryReq.pageNumber > pagesCount
    //                     ? pagesCount
    //                     : queryReq.pageNumber,
    //             pageSize: queryReq.pageSize,
    //             totalCount: totalCount,
    //             items,
    //         };
    //     }

    //     const statusLike: { id: string; rating: Rating }[] =
    //         await this.likeService.getRatingForEntities(
    //             postIds,
    //             userId,
    //             LikePost,
    //         );

    //     const items: PostViewType[] = [];

    //     for (let i = 0; i < postIds.length; i++) {
    //         const newestLikes: Array<LastLikesViewType> = lastLikes.find(
    //             (el) => el.postId === searchItem[i]._id.toString(),
    //         )!.newestLikes;

    //         const rating = statusLike.find(
    //             (el) => el.id === searchItem[i]._id.toString(),
    //         )!.rating;
    //         items.push(this.mapDbToView(searchItem[i], rating, newestLikes));
    //     }
    //     return {
    //         pagesCount: pagesCount,
    //         page:
    //             queryReq.pageNumber > pagesCount
    //                 ? pagesCount
    //                 : queryReq.pageNumber,
    //         pageSize: queryReq.pageSize,
    //         totalCount: totalCount,
    //         items,
    //     };
    // }
}
