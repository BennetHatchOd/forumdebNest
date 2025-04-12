import { IsString, IsUrl, Length } from 'class-validator';
import { BlogFieldRestrict } from '../../field.restrictions';

export class BlogInputDto {
    @IsString()
    @Length(BlogFieldRestrict.nameMin, BlogFieldRestrict.nameMax)
    public name:        string;

    @IsString()
    @Length(BlogFieldRestrict.descriptionMin, BlogFieldRestrict.descriptionMax)
    public description: string;

    @IsUrl()
    @Length(BlogFieldRestrict.websiteUrlMin, BlogFieldRestrict.websiteUrlMax)
    public websiteUrl:  string;
}