import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { LikeRepository } from '@modules/blogging.platform/infrastucture/like.repository';
import { Like, LikeDocument, LikeModelType } from '@modules/blogging.platform/domain/like.entity';

export class MakeLikeCommand extends Command<void> {
    constructor(
        public likeDto: LikeCreateDto,
    ) {
        super()}
}

@CommandHandler(MakeLikeCommand)
export class MakeLikeHandler implements ICommandHandler<MakeLikeCommand> {
    constructor(
        private likeRepository: LikeRepository,
        @InjectModel(Like.name) private likeModel: LikeModelType,
    ) {
    }

    async execute({ likeDto }: MakeLikeCommand): Promise<void> {
        const foundLike: LikeDocument | null = await this.likeRepository.findLikeDislike(likeDto);

        if(!foundLike) {
            const newLike: LikeDocument = this.likeModel.createInstance(likeDto);
            await this.likeRepository.save(newLike);
            return ;
        }
        if(foundLike.rating === likeDto.rating)
            return;

        foundLike.rating = likeDto.rating;
        await this.likeRepository.save(foundLike);
        return;
    }
}
