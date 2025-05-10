import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { InjectModel } from '@nestjs/mongoose';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { LikeRepository } from '@modules/blogging.platform/infrastucture/like.repository';
import { Like, LikeDocument } from '@modules/blogging.platform/domain/like.entity';

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
        @InjectModel(Like.name) private likeModel: LikeDocument,
    ) {
    }

    async execute({ likeDto }: MakeLikeCommand): Promise<void> {
        const foundLike: LikeDocument | null = await this.likeRepository.findLikeDislike(likeDto);

        if(!foundLike) {
            const newLike: LikeDocument = await Like.createInstance(likeDto);
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
