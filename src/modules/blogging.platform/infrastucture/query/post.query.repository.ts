import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../../domain/post.entity';
import { PostViewDto } from '../../dto/view/post.view.dto';
import { FilterQuery, Types } from 'mongoose';
import { GetPostQueryParams } from '../../dto/input/get.post.query.params.input.dto';
import { PaginatedViewDto } from '@core/dto/base.paginated.view.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { LikesQueryRepositories } from '@modules/blogging.platform/infrastucture/query/likes.query.repositories';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';
import { NewestLikesDto } from '@modules/blogging.platform/dto/view/newest.likes';
import { EmptyPaginator } from '@core/dto/empty.paginator';
import { LikesDescriptionManyDto } from '@modules/blogging.platform/dto/likes.description.many.dto';

import { ExtendedPartInfo } from '@modules/blogging.platform/dto/extended.part.info';

@Injectable()
export class PostQueryRepository {
    constructor(
    // private likeService: LikeService,
        @InjectModel(Post.name) private PostModel: PostModelType,
        private likesQueryRepository: LikesQueryRepositories,
    ){}

    async  findByIdWithCheck(
        id: string,
        userId: string|null = null): Promise<PostViewDto> {
        // returns a post by id, if comment isn't found throws an exception

        if (!Types.ObjectId.isValid(id))
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound,
            });
        const searchItem: PostDocument | null
            = await this.PostModel.findOne({
                                            _id: new Types.ObjectId(id),
                                            deletedAt: null
                                        });
        if(!searchItem)
            throw new DomainException({
                message: 'post not found',
                code: DomainExceptionCode.NotFound});

        const likeDescriptionDto = {
            targetId: id,
            ownerId: userId,
            targetType: LikeTarget.Post};

        const likeInfo: LikesInfoViewDto
            = await this.likesQueryRepository.findOneLikeInfo(likeDescriptionDto)
        // базовая информация о посте - counts, status

        const extendedInfo:NewestLikesDto
            = await this.likesQueryRepository.findOneExtendedLikes(likeDescriptionDto)

        return PostViewDto.mapToView(searchItem, likeInfo, extendedInfo);
    }

    async find(queryReq: GetPostQueryParams, userId: string|null = null): Promise<PaginatedViewDto<PostViewDto>> {

        const blogIdSearch = queryReq.searchBlogId
            ? { blogId: { $regex: queryReq.searchBlogId, $options: 'i' } }
            : {};
        const queryFilter: FilterQuery<Post> = { ...blogIdSearch, deletedAt: null };
        const totalCount: number = await this.PostModel.countDocuments(queryFilter);

        if(totalCount === 0)
            return new EmptyPaginator<PostViewDto>();

        const posts: PostDocument[] = await this.PostModel.find(queryFilter)
            .limit(queryReq.pageSize)
            .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
            .sort({ [queryReq.sortBy]: queryReq.sortDirection });

        const targetIds: string[] = posts.map((post: PostDocument) => post._id.toString())

        const likesDescription: LikesDescriptionManyDto ={
            targetIds: targetIds,
            ownerId: userId,
            targetType: LikeTarget.Post,
        }
        const likesInfo: LikesInfoViewDto[]
            = await this.likesQueryRepository.findManyLikesInfo(likesDescription);

        const extendedPart: ExtendedPartInfo[] = await this.likesQueryRepository.findManyExtendedLikes(likesDescription)

        return PaginatedViewDto.mapToView({
            items: this.mapPostsView(posts, likesInfo, extendedPart),
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount,
        });
    }
    private mapPostsView(posts: PostDocument[],
                         likeInfos: LikesInfoViewDto[],
                         newestLikes: ExtendedPartInfo[]){

        const postView: PostViewDto[] = posts.map((value: PostDocument, index: number) =>
            (PostViewDto.mapToView(
                value,
                likeInfos[index],
                {newestLikes:
                        newestLikes.find(extended => extended.targetId === value._id.toString())?.newestLikes ?? []
                }
            )))

        return postView;
    }

}
