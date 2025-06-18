import { PostByBlogInputDto } from './post.by.blog.input.dto';
import { IsNumber, IsString, Min } from 'class-validator';

export class PostInputDto extends PostByBlogInputDto{
    @IsString()
    public blogId: string;
    }