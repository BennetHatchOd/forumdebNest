export class BlogInputType {
    constructor(
        public name:        string,     // length 1-15
        public description: string,     // length 1-500
        public websiteUrl:  string,     // length 1-100, ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    ) {}
}

export class BlogViewType {
    constructor(
        public id:              string,
        public name:            string,
        public description:     string,
        public createdAt:       string,
        public isMembership:    boolean,
        public websiteUrl:      string,
    ) {}
}

// export class BlogType {
//     constructor(
//         public id:              string,
//         public name:            string,
//         public description:     string,
//         public createdAt:       Date,
//         public isMembership:    boolean,
//         public websiteUrl:      string,
//         public deletedAt:       Date|null,
//     ) {}
// }
