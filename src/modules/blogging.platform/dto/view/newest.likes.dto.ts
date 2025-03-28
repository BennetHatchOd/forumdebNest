import { NewestLikesArray } from '../../domain/newest.likes';

export class NewestLikesDTO {
    newestLikes: LikeDetailsView[] = []
    constructor(item: NewestLikesArray) {
        for (let i in item)
            this.newestLikes.push({
                addedAt: item[i].addedAt,
                userId: item[i].userId,
                login: item[i]. login,
            })
    }
}

export type LikeDetailsView = {
    addedAt: string,
    userId: string,
    login: string,
}