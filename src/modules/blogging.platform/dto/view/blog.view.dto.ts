import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewDto {
        id:              string;
        name:            string;
        description:     string;
        createdAt:       string;
        isMembership:    boolean;
        websiteUrl:      string;

    static   mapToView(item: BlogDocument): BlogViewDto {
        const mappedBlog = new this();

        mappedBlog.id = item._id.toString();
        mappedBlog.name = item.name;
        mappedBlog.description = item.description;
        mappedBlog.createdAt = item.createdAt.toISOString();
        mappedBlog.isMembership = item.isMembership;
        mappedBlog.websiteUrl = item.websiteUrl;

        return mappedBlog;
    }
}
