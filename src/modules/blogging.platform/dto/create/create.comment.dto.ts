export class CreateCommentDto{
    constructor(
        public postId: number,
        public content: string,
        public userId: number,
    ){}
}