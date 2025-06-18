import { Inject, Injectable } from '@nestjs/common';
import { Post } from '../../domain/post.entity';
import { PostViewDto } from '../../dto/view/post.view.dto';
import { GetPostQueryParams, PostSortBy } from '../../dto/input/get.post.query.params.input.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { EmptyPaginator } from '@core/dto/empty.paginator';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';
import { PostRepository } from '@modules/blogging.platform/infrastucture/post.repository';
import { FilterQuery } from '@core/infrastucture/filter.query';
import { PostTupleDto } from '@modules/blogging.platform/dto/post.tuple.dto';
import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import { BlogSortBy } from '@modules/blogging.platform/dto/input/get.blog.query.params.input.dto';

@Injectable()
export class PostQueryRepository {
    constructor(
    @Inject(DATA_SOURCE) protected dataSource: DataSource,
    private postRepository: PostRepository
        //private likesQueryRepository: LikesQueryRepositories,
    ){}

    async  findByIdWithCheck(
        id: number,
        userId: number|null = null): Promise<PostViewDto> {
        // returns a post by id, if post isn't found throws an exception "Not Found",
        // if blog isn't found throws an exception "Not Found blog with BlogId"

        const { clause, values } = new FilterQuery({
            id: id,
            deletedAt: null
        }).buildWhereClause();

        const result: PostTupleDto[] = await this.dataSource.query(`
            SELECT posts.*, 
                   blogs.name "blogName"   
            FROM public.posts 
            JOIN public.blogs ON public.blogs.id = posts."blogId"
            WHERE posts.id = $1 
              AND posts."deletedAt" IS NULL
              AND blogs."deletedAt" IS NULL  
            LIMIT 1`,
            [id]
        );

        if (result.length === 0)
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound});

        const likesCount = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: Rating.None,
        }
        const newestLikes = {
            newestLikes: []
        }
        return PostViewDto.mapToView(result[0], likesCount, newestLikes);

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
        //
        // return PostViewDto.mapToView(searchItem, likeInfo, extendedInfo);
    }

    async find(queryReq: GetPostQueryParams, userId: string|null = null): Promise<PaginatedViewDto<PostViewDto>> {

        const {clause, values} = new FilterQuery<Post>({
            blogId: queryReq.searchBlogId}).buildWhereClause();

        const sqlRequest = `
            FROM public.posts p
            JOIN public.blogs b ON b.id = p."blogId" 
             ${clause} AND b."deletedAt" IS NULL AND p."deletedAt" IS NULL`;

        const sqlCount = `SELECT COUNT(*) AS count ${sqlRequest};`;
        const totalCount = (await this.dataSource.query(sqlCount + ';', values))[0].count;

        if(queryReq.pageNumber > Math.ceil(totalCount / queryReq.pageSize))
            queryReq.pageNumber = Math.ceil(totalCount / queryReq.pageSize);
        const collate = [PostSortBy.Title, PostSortBy.BlogName, PostSortBy.Content].includes(queryReq.sortBy)
            ? ' COLLATE "C"'
            : '';

        const sql = ` 
            SELECT 
                p.*, 
                b.name AS "blogName"
                ${sqlRequest}
            ORDER BY p."${queryReq.sortBy}" ${collate} ${queryReq.sortDirection} 
            LIMIT ${queryReq.pageSize} OFFSET ${(queryReq.pageNumber - 1) * queryReq.pageSize};`;


        if(+totalCount === 0)
            return new EmptyPaginator<PostViewDto>();

        const posts: PostTupleDto[] = await this.dataSource.query(sql, values);

        // const targetId0s: string[] = posts.map((post: PostDocument) => post._id.toString())
        //
        // const likesDescription: LikesDescriptionManyDto ={
        //     targetIds: targetIds,
        //     ownerId: userId,
        //     targetType: LikeTarget.Post,
        // }
        // const likesInfo: LikesInfoViewDto[]
        //     = await this.likesQueryRepository.findManyLikesInfo(likesDescription);
        //
        // const extendedPart: ExtendedPartInfo[] = await this.likesQueryRepository.findManyExtendedLikes(likesDescription)

        return PaginatedViewDto.mapToView({
            items: this.mapPostsViewSimple(posts),
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount,
        });
    }
    private mapPostsViewSimple(posts: PostTupleDto[]){

        const postView: PostViewDto[] = posts.map((value: PostTupleDto) =>
            (PostViewDto.mapToView(
                value,
                {   likesCount: 0,
                    dislikesCount: 0,
                    myStatus: Rating.None },
                {newestLikes: [] }
            )))

        return postView;
    }

    // private mapPostsView(posts: PostTupleDto[],
    //                      likeInfos: LikesInfoViewDto[],
    //                      newestLikes: ExtendedPartInfo[]){
    //
    //     const postView: PostViewDto[] = posts.map((value: PostTupleDto, index: number) =>
    //         (PostViewDto.mapToView(
    //             value,
    //             likeInfos[index],
    //             {newestLikes:
    //                     newestLikes.find(extended => extended.targetId === value.id.toString())?.newestLikes ?? []
    //             }
    //         )))
    //
    //     return postView;
    // }

}
