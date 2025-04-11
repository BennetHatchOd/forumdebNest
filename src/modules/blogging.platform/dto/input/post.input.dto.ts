import { PostByBlogInputDto } from './post.by.blog.input.dto';
import { IsString } from 'class-validator';

export class PostInputDto extends PostByBlogInputDto{
    @IsString()
    public blogId: string;
    }