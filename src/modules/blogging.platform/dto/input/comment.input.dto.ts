import { IsString, Length } from 'class-validator';
import { CommentFieldRestrict } from '../../field.restrictions';

export class CommentInputType {
    @IsString()
    @Length(CommentFieldRestrict.contentMin, CommentFieldRestrict.contentMax)
    public content: string;
}