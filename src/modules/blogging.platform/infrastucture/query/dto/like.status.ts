import { Rating } from '@modules/blogging.platform/dto/enum/rating.enum';

export class LikesStatusDto{
    status: Rating;
    targetId: string;
};