import { Inject, Injectable } from '@nestjs/common';
import { Post } from '../../domain/post.entity';
import { PostViewDto } from '../../dto/view/post.view.dto';
import { GetPostQueryParams } from '../../dto/input/get.post.query.params.input.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { NewestLikesDto } from '@modules/blogging.platform/dto/view/newest.likes';
import { EmptyPaginator } from '@core/dto/empty.paginator';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';
import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import console from 'node:console';

@Injectable()
export class PostQueryRepository {
    constructor(
        @Inject(DATA_SOURCE) private dataSource: DataSource,
    ){}

    async  findByIdWithCheck(
        id: string,
        userId: string|null = null): Promise<PostViewDto> {
        // returns a post by id, if post isn't found throws an exception

        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId < 1)
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound,
            });

        const searchItem: Post[] = await this.dataSource.query(`
                    SELECT p.*, b.name AS "blogName"
                    FROM public.posts p
                    JOIN public.blogs b on b.id = p."blogId"
                    WHERE p.id = $1 AND p."deletedAt" IS NULL 
                      AND b."deletedAt" IS NULL 
                    LIMIT 1`,
            [numericId]
        );
        if (searchItem.length == 0)
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound,
            });

        // const likeDescriptionDto = {
        //     targetId: id,
        //     ownerId: userId,
        //     targetType: LikeTarget.Post};
        //
        // const likeInfo: LikesInfoViewDto
        //     = await this.likesQueryRepository.findOneLikeInfo(likeDescriptionDto)
        // // базовая информация о посте - counts, status
        //
        // const extendedInfo:NewestLikesDto
        //     = await this.likesQueryRepository.findOneExtendedLikes(likeDescriptionDto)

        const likeInfo: LikesInfoViewDto = {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: Rating.None
            };
        const likes: NewestLikesDto ={ newestLikes:  []};

        return PostViewDto.mapToView(searchItem[0], likeInfo, likes);
    }

    async find(queryReq: GetPostQueryParams, userId: string|null = null): Promise<PaginatedViewDto<PostViewDto>> {

        let whereSql: string = `p."deletedAt" IS NULL AND b."deletedAt" IS NULL`;
        const queryParams: any[] = [];

        if (queryReq.searchBlogId) {
            whereSql += ` AND b.id = $1`;
            queryParams.push(`${queryReq.searchBlogId}`);
        }

        let orderBy: string;
        switch (queryReq.sortBy) {
            case 'title':
            case 'shortDescription':
            case 'content':
                orderBy =
                    `p."${queryReq.sortBy}" COLLATE "C" ${queryReq.sortDirection}`
                break;
            case 'blogName':
                orderBy =
                    `b."name" COLLATE "C" ${queryReq.sortDirection}`
                break;
                default:
                    orderBy =
                    `p."${queryReq.sortBy}" ${queryReq.sortDirection}`
        }

        // const orderBy =
        //     queryReq.sortBy === 'title' || queryReq.sortBy === 'shortDescription'
        //     || queryReq.sortBy === 'content' || queryReq.sortBy === 'blogName'
        //         ? `p."${queryReq.sortBy}" COLLATE "C" ${queryReq.sortDirection}`
        //         : `"${queryReq.sortBy}" ${queryReq.sortDirection}`;

        const sqlRequest = `FROM public.posts p 
            JOIN public.blogs b on b.id = p."blogId" 
            WHERE ${whereSql}`;
        const sqlCount = `SELECT COUNT(*) AS count ${sqlRequest};`;

        const totalCount: number = +(await this.dataSource.query(sqlCount, queryParams))[0].count;
        queryReq.calculateSkip(totalCount);

        const sqlQuery = ` SELECT p.*, b.name AS "blogName" ${sqlRequest}
            ORDER BY ${orderBy} 
            LIMIT ${queryReq.pageSize} OFFSET ${queryReq.skip};`;


        if(totalCount === 0)
            return new EmptyPaginator<PostViewDto>();

        const posts: Post[] = await this.dataSource.query(sqlQuery, queryParams);


        // const likesDescription: LikesDescriptionManyDto ={
        //     targetIds: targetIds,
        //     ownerId: userId,
        //     targetType: LikeTarget.Post,
        // }
        // // const likesInfo: LikesInfoViewDto[]
        //     = await this.likesQueryRepository.findManyLikesInfo(likesDescription);
        //
        // const extendedPart: ExtendedPartInfo[] = await this.likesQueryRepository.findManyExtendedLikes(likesDescription)

        return PaginatedViewDto.mapToView({
            items: this.mapPostsView(posts),// likesInfo, extendedPart),
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount,
        });
    }
    private mapPostsView(posts: Post[],){
                         // likeInfos: LikesInfoViewDto[],
                         // newestLikes: ExtendedPartInfo[]){

        const likeInfo: LikesInfoViewDto = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: Rating.None
        };
        const likes: NewestLikesDto ={ newestLikes:  []};

        const postView: PostViewDto[] = posts.map((value: Post) =>
            (PostViewDto.mapToView(
                value,
                likeInfo,
                likes
            )))

        return postView;


        // const postView: PostViewDto[] = posts.map((value: Post, index: number) =>
        //     (PostViewDto.mapToView(
        //         value,
        //         likeInfos[index],
        //         {newestLikes:
        //                 newestLikes.find(extended => extended.targetId === value._id.toString())?.newestLikes ?? []
        //         }
        //     )))
        //
        // return postView;
    }

}
