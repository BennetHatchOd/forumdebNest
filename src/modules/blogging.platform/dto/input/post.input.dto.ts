export class PostInputDto {
    constructor(
        public title: string, // length 1-30
        public shortDescription: string, // length 1-100
        public content: string, // length 1-1000
        public blogId: string,
    ) {}
}