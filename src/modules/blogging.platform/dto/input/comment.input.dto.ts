import { CommentFieldRestrict } from '../../field.restrictions';
import { TrimLength } from '../../../../core/decorators/trim.string.length';

export class CommentInputType {
    @TrimLength(CommentFieldRestrict.contentMin, CommentFieldRestrict.contentMax)
    public content: string;
}