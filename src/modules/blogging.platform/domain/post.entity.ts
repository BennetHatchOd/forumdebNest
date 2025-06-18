import { PostInputDto } from '../dto/input/post.input.dto';

export class Post {
    id?: number;
    title: string;
    shortDescription: string;
    content: string;
    createdAt: Date;
    blogId: number;
    deletedAt:  Date | null;

    delete() {
        if (this.deletedAt !== null) {
            throw new Error('Post already deleted');
        }
        this.deletedAt = new Date();
    }

    async update(change: PostInputDto) {
        this.title = change.title;
        this.shortDescription = change.shortDescription;
        this.content = change.content;
        this.blogId = Number(change.blogId);
    }

    static createInstance(createDto: PostInputDto): Post {

        const post = new this();
        post.title = createDto.title;
        post.shortDescription = createDto.shortDescription;
        post.content = createDto.content;
        post.blogId = Number(createDto.blogId);
        post.deletedAt = null

        return post;
    }
}

