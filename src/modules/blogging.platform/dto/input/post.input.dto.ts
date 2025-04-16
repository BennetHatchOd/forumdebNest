import { PostByBlogInputDto } from './post.by.blog.input.dto';
import { IsMongoId } from 'class-validator';

export class PostInputDto extends PostByBlogInputDto{
    @IsMongoId()
    public blogId: string;
    }