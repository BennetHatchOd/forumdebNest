import { Blog } from '@modules/blogging.platform/domain/blog.entity';

export class BlogViewDto {
        id:              string;
        name:            string;
        description:     string;
        createdAt:       string;
        isMembership:    boolean;
        websiteUrl:      string;
        constructor(item: Blog) {
            this.id = item.id!.toString();
            this.name = item.name;
            this.description = item.description;
            this.createdAt = item.createdAt.toISOString();
            this.isMembership = item.isMembership;
            this.websiteUrl = item.websiteUrl;
        }
    public static   mapToView(item: Blog): BlogViewDto {
        return  new BlogViewDto(item);
    }
}
