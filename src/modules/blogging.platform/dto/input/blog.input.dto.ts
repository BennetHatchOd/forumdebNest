
export class BlogInputDto {
    constructor(
        public name:        string,     // length 1-15
        public description: string,     // length 1-500
        public websiteUrl:  string,     // length 1-100, ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    ) {}
}