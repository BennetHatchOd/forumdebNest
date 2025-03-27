import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewDto {
        id:              string;
        name:            string;
        description:     string;
        createdAt:       string;
        isMembership:    boolean;
        websiteUrl:      string;
        constructor(item: BlogDocument) {
            this.id = item._id.toString();
            this.name = item.name;
            this.description = item.description;
            this.createdAt = item.createdAt.toISOString();
            this.isMembership = item.isMembership;
            this.websiteUrl = item.websiteUrl;
        }
    static   mapToView(item: BlogDocument): BlogViewDto {
        return  new BlogViewDto(item);
    }
}
