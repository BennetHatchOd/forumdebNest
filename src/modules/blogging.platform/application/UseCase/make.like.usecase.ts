import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { LikeRepository } from '@modules/blogging.platform/infrastucture/like.repository';
import {
    Like,
    LikeDocument,
    LikeModelType,
} from '@modules/blogging.platform/domain/like.entity';
import { CommentRepository } from '@modules/blogging.platform/infrastucture/comment.repository';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { LikeTarget } from '@modules/blogging.platform/dto/enum/like.target.enum';
import { PostRepository } from '@modules/blogging.platform/infrastucture/post.repository';

export class MakeLikeCommand extends Command<void> {
    constructor(public likeDto: LikeCreateDto) {
        super();
    }
}

@CommandHandler(MakeLikeCommand)
export class MakeLikeHandler implements ICommandHandler<MakeLikeCommand> {
    constructor(
        private likeRepository: LikeRepository,
        private commentRepository: CommentRepository,
        private postRepository: PostRepository,
        @InjectModel(Like.name) private likeModel: LikeModelType,
    ) {}

    async execute({ likeDto }: MakeLikeCommand): Promise<void> {
        await this.checkEntityExist(likeDto);

        const foundLike: LikeDocument | null =
            await this.likeRepository.findLikeDislike(likeDto);

        if (!foundLike) {
            const newLike: LikeDocument =
                this.likeModel.createInstance(likeDto);
            await this.likeRepository.save(newLike);
            return;
        }
        if (foundLike.rating === likeDto.rating) return;

        foundLike.rating = likeDto.rating;
        await this.likeRepository.save(foundLike);
        return;
    }

    private async checkEntityExist (likeDto: LikeCreateDto):Promise<void> {

        switch (likeDto.targetType) {
            case LikeTarget.Post:
                if(!await this.postRepository.isExist(likeDto.targetId))
                    throw new DomainException({
                        message: 'Path not found',
                        code: DomainExceptionCode.NotFound,
                    });
                    return;
            case LikeTarget.Comment:
                if(!await this.commentRepository.isExist(likeDto.targetId))
                    throw new DomainException({
                        message: 'Path not found',
                        code: DomainExceptionCode.NotFound,
                    });
                    return;
        }

    };
}
