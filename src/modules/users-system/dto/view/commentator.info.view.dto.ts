import { UserTuple } from '@modules/users-system/domain/user.tuple';

export class CommentatorInfoViewDto {
        userId:          string;
        login:           string;

    constructor(user: UserTuple) {
        this.userId = user.id.toString();
        this.login = user.login;
    }

    static   mapToView(inputUser: UserTuple): CommentatorInfoViewDto {
        return  new CommentatorInfoViewDto(inputUser);
    }
}
