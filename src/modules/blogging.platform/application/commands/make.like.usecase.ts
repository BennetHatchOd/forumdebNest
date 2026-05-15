import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { LikeRepository } from '@modules/blogging.platform/infrastucture/like.repository';
import { Like } from '@modules/blogging.platform/domain/like.entity';

export class MakeLikeCommand extends Command<void> {
    constructor(public likeDto: LikeCreateDto) {
        super();
    }
}

@CommandHandler(MakeLikeCommand)
export class MakeLikeHandler implements ICommandHandler<MakeLikeCommand> {
    constructor(
        private likeRepository: LikeRepository,
    ) {}

    async execute({ likeDto }: MakeLikeCommand): Promise<void> {

        const foundLike: Like | null =
            await this.likeRepository.findLike(likeDto);

        if (!foundLike) {
            const newLike: Like = Like.createInstance(likeDto);
            await this.likeRepository.saveLike(newLike, likeDto.targetType);
            return;
        }
        if (foundLike.status === likeDto.status) return;

        foundLike.status = likeDto.status;
        await this.likeRepository.saveLike(foundLike, likeDto.targetType);
        return;
    }
}
