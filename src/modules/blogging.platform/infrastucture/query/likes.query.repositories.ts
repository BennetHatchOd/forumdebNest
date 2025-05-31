import { InjectModel, Prop } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModelType } from '@modules/blogging.platform/domain/like.entity';
import { LikesDescriptionDto } from '@modules/blogging.platform/dto/likes.description.dto';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';
import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';
import { LikesDescriptionManyDto } from '@modules/blogging.platform/dto/likes.description.many.dto';
import console from 'node:console';
import { LikesCountDto } from '@modules/blogging.platform/infrastucture/query/dto/like.counts';
import { LikesStatusDto } from '@modules/blogging.platform/infrastucture/query/dto/like.status';
import { UserQueryExternalRepository } from '@modules/users-system/infrastucture/query/user.query.external.repository';
import { NewestLikesDto } from '@modules/blogging.platform/dto/view/newest.likes';
import { ExtendedPartInfo } from '@modules/blogging.platform/dto/extended.part.info';


export class LikesQueryRepositories{
    constructor(
        @InjectModel(Like.name) private LikeModel: LikeModelType,
        private userQueryExternalRepository: UserQueryExternalRepository,) {
    }

    async findOneLikeInfo(likeInfoDto: LikesDescriptionDto): Promise< LikesInfoViewDto> {
        // return like info for one entity
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

    async findOneExtendedLikes(likeInfoDto: LikesDescriptionDto): Promise< NewestLikesDto> {


        const likes: LikeDocument[]
            = await this.LikeModel.find({
                targetType: likeInfoDto.targetType,
                targetId: likeInfoDto.targetId,
                rating: Rating.Like,})
            .sort({createdAt: -1})
            .limit(3)
        // return 3 last likes for one entity

        const likeUserId: string[] = likes.map((like: LikeDocument) => like.ownerId.toString())
        const usersLogins = await this.userQueryExternalRepository.getManyLoginsByUserIds(likeUserId);
        // получаем логин юзеров, поставивших последние 3 лайка

        const extendedInfo: NewestLikesDto = {newestLikes:
                likes.map((like:LikeDocument) => {
                    return {
                        addedAt: like.createdAt.toISOString(),
                        userId: like.ownerId,
                        login: usersLogins.find(user => user.userId === like.ownerId)!.login
                    }
                })
        }

        return extendedInfo;
    }

    async findManyExtendedLikes(likeInfoDto: LikesDescriptionManyDto): Promise< ExtendedPartInfo[]> {
        // return 3 last likes for many entities
        const lastLikes = await this.LikeModel.aggregate([
            {$match: {
                    targetType: likeInfoDto.targetType,
                    rating:     Rating.Like,
                    targetId:   {$in: likeInfoDto.targetIds}}},
            {$sort: {createdAt: -1}},
            {$group: {
                    _id: "$targetId",
                    likes: {$push: {addedAt: "$createdAt",
                            userId: "$ownerId" }}
                }},
            {$project: {
                    targetId:   "$_id",
                    likes:      { $slice: ["$likes", 3]}
                }}
        ])

        const userIds: string[] = [];
        lastLikes.forEach(likeInfo => likeInfo.likes.forEach(like => userIds.push(like.userId)));
        const uniqUserId = Array.from(new Set(userIds));
        const usersLogins = await this.userQueryExternalRepository.getManyLoginsByUserIds(uniqUserId);

        const extendedPartInfo
            = lastLikes.map(entityInfo => ({
                targetId: entityInfo.targetId,
                newestLikes: entityInfo.likes.map((like) => {
                        return {
                            addedAt: like.addedAt.toISOString(),
                            userId: like.userId,
                            login: usersLogins.find(user => user.userId === like.userId)!.login
                            }
                        })
                })
            )
        return extendedPartInfo;
    }

    async findManyLikesInfo(likesDto: LikesDescriptionManyDto):Promise<LikesInfoViewDto[]>{
        // return likeInfo (counts with status) for array of entity's ids
        const likesCounts = await this.getManyLikesCounts(likesDto);

        const likesStatus : LikesStatusDto[] = await this.getUserManyLikesStatus(likesDto);

        const likesInfo: LikesInfoViewDto[]
            = likesDto.targetIds.map((targetId) => {
                const counts = likesCounts.find(s => s.id === targetId);
                let status: LikesStatusDto | undefined = undefined;
                if(likesDto.ownerId)
                    status = likesStatus.find(s => s.targetId === targetId);
                const likeInfo ={
                    likesCount: counts!.likesCount,
                    dislikesCount: counts!.dislikesCount,
                    myStatus: status?.status?? Rating.None,
                };
                return likeInfo;
            })
        return likesInfo
    }

    private async getManyLikesCounts(likesDto: LikesDescriptionManyDto): Promise<LikesCountDto[]> {
        // return likeInfo(only counts without status) for array of entity's ids
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

        const likes:LikesCountDto[] = likesDto.targetIds.map((id:string)=>({
            id: id,
            likesCount: resultAggr[0][id + "Like"]?.[0]?.count ?? 0,
            dislikesCount: resultAggr[0][id + "Dislike"]?.[0]?.count ?? 0,
        }))
            return likes;
    }

    private async getUserManyLikesStatus(likesDto: LikesDescriptionManyDto): Promise<LikesStatusDto[]> {
        // return pairs of values {targetIs, status}, where status is the user's rating for each entity,
        // if the user is not authorized, fill in the statuses as Rating.None, without accessing the database
        if(!likesDto.ownerId){
            const emptyStatus
                = likesDto.targetIds.map(id => ({targetId: id, status: Rating.None}));
            return emptyStatus;
        }
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