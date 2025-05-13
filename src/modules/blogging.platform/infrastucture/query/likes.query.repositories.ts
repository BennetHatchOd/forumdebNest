import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '@modules/blogging.platform/domain/like.entity';
import { LikesDescriptionDto } from '@modules/blogging.platform/dto/likes.description.dto';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';
import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { LikesDescriptionManyDto } from '@modules/blogging.platform/dto/likes.description.many.dto';
import console from 'node:console';
import { LikesCountDto } from '@modules/blogging.platform/infrastucture/query/dto/like.counts';
import { LikesStatusDto } from '@modules/blogging.platform/infrastucture/query/dto/like.status';

export class LikesQueryRepositories{
    constructor(
        @InjectModel(Like.name) private LikeModel: LikeModelType,) {
    }

    async findOneLikeInfo(likeInfoDto: LikesDescriptionDto): Promise< LikesInfoViewDto> {
        const [likeCount, dislikeCount, userStatus] = await Promise.all([
            this.LikeModel.countDocuments({
                targetType: likeInfoDto.targetType,
                targetId: likeInfoDto.targetId,
                rating: Rating.Like, }),
            this.LikeModel.countDocuments({
                targetType: likeInfoDto.targetType,
                targetId: likeInfoDto.targetId,
                rating: Rating.Dislike,}),
            likeInfoDto.ownerId ? this.LikeModel.findOne({
                    targetType: likeInfoDto.targetType,
                    targetId: likeInfoDto.targetId,
                    ownerId: likeInfoDto.ownerId})
                : Promise.resolve(null),
        ])

        const likeStatus: Rating = userStatus ? userStatus.rating : Rating.None;

        return {
            likesCount: likeCount,
            dislikesCount: dislikeCount,
            myStatus: likeStatus,
        };
    }

    async findManyLikesInfo(likesDto: LikesDescriptionManyDto):Promise<LikesInfoViewDto[]>{
        const likesCounts = await this.getManyLikesCounts(likesDto);
        const likesStatus : LikesStatusDto[] = await this.getUserManyLikesStatus(likesDto);

        const likesInfo: LikesInfoViewDto[] = likesDto.targetIds.map((targetId) => {
            const counts = likesCounts.find(s => s.id === targetId);
            const status = likesStatus.find(s => s.targetId === targetId);
            const likeInfo ={
                likesCount: counts!.likesCount,
                dislikesCount: counts!.dislikesCount,
                myStatus: status?.status?? Rating.None,
            };
            return likeInfo;
        })
        return likesInfo
    }

    async getManyLikesCounts(likesDto: LikesDescriptionManyDto): Promise<LikesCountDto[]> {

    const facet = likesDto.targetIds.reduce((prev, curr) =>{
        return {
            ...prev,
            [curr + 'Like']: [
                {
                    $match: {
                        targetId: curr,
                        rating: Rating.Like,
                        targetType: likesDto.targetType,
                    }
                },
                { $count: 'count' },
            ],
            [curr + 'Dislike']: [
                {
                    $match: {
                        targetId: curr,
                        rating: Rating.Dislike,
                        targetType: likesDto.targetType,
                    }
                },
                { $count: 'count' },
            ],
        };
        }, {});

    const resultAggr = await this.LikeModel.aggregate([{$facet: facet}])

     const likes:LikesCountDto[] = []
    for(let id of likesDto.targetIds){
        const like: LikesCountDto ={
            id: id,
            likesCount: resultAggr[0][id + "Like"]?.[0]?.count ?? 0,
            dislikesCount: resultAggr[0][id + "Dislike"]?.[0]?.count ?? 0,
        }
        likes.push(like);
    }
        return likes;
    }

    async getUserManyLikesStatus(likesDto: LikesDescriptionManyDto): Promise<LikesStatusDto[]> {

        const likesUser = await this.LikeModel.aggregate([
            {
                $match: {
                    targetType: likesDto.targetType,
                    ownerId: likesDto.ownerId,
                    targetId: { $in: likesDto.targetIds },
                }
            },
            {
                $project: {
                    targetId: "$targetId",
                    status: "$rating"
                }
            }
        ]);
        return likesUser;
    }
}