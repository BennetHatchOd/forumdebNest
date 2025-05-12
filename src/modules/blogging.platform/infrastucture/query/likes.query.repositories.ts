import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '@modules/blogging.platform/domain/like.entity';
import { LikesInfoDto } from '@modules/blogging.platform/dto/likes.dto';
import { LikeTarget } from '@modules/blogging.platform/dto/like.target.enum';
import { Rating } from '@modules/blogging.platform/dto/rating.enum';
import { LikesInfoViewDto } from '@modules/blogging.platform/dto/view/likes.info.view.dto';

export class LikesQueryRepositories{
    constructor(
        @InjectModel(Like.name) private LikeModel: LikeModelType,) {
    }

    async findLikeInfo(likeInfoDto: LikesInfoDto): Promise< LikesInfoViewDto> {
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
}