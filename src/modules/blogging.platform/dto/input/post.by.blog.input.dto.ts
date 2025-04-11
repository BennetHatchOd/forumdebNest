import { IsString, Length } from 'class-validator';
import { PostFieldRestrict } from '../../field.restrictions';

export class PostByBlogInputDto {
    @IsString()
    @Length(PostFieldRestrict.titleMin, PostFieldRestrict.titleMax)
    public title: string;

    @IsString()
    @Length(PostFieldRestrict.shortDescriptionMin, PostFieldRestrict.shortDescriptionMax)
    public shortDescription: string;

    @IsString()
    @Length(PostFieldRestrict.contentMin, PostFieldRestrict.contentMax)
    public content: string;
}



