import { UserInputDto } from '@src/modules/users-system/dto/input/user.input.dto';
import { CommentInputDto } from '@src/modules/blogging.platform/dto/input/comment.input.dto';
import { BlogInputDto } from '@src/modules/blogging.platform/dto/input/blog.input.dto';
import { PostInputDto } from '@src/modules/blogging.platform/dto/input/post.input.dto';
import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AUTH_PATH, URL_PATH } from '@src/core/url.path.setting';
import { AuthBasic } from './auth.basic';
import { UserConfig } from '@src/modules/users-system/config/user.config';
import * as console from 'node:console';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '@src/modules/blogging.platform/domain/blog.entity';
import { Post, PostDocument, PostModelType } from '@src/modules/blogging.platform/domain/post.entity';
import { Comment, CommentDocument, CommentModelType } from '@src/modules/blogging.platform/domain/comment.entity';
import { User, UserDocument, UserModelType } from '@src/modules/users-system/domain/user.entity';
import { CreateCommentDto } from '@src/modules/blogging.platform/dto/create.comment.dto';

export class TestDataBuilderByDb {
    // создаем первоначальное наполнение системы, при этом тестируя
    // базовые ендпоинты по созданию сущностей системы: blog, post, comment, user
    accessTokens: string[] = [];
    users: UserDocument[] = [];
    comments: CommentDocument[] = [];
    blogs: BlogDocument[] = [];
    posts: PostDocument[] = [];
    authLoginPassword: string = '';

    constructor(private app:INestApplication,
                @InjectModel(Blog.name)private BlogModel: BlogModelType,
                @InjectModel(Post.name)private PostModel: PostModelType,
                @InjectModel(Comment.name)private CommentModel: CommentModelType,
                @InjectModel(User.name)private UserModel: UserModelType,
                readonly numberUsers : number = 1,
                readonly numberBlogs: number = 1,
                readonly numberPosts : number = 1,
                readonly numberComments : number = 1,
    ) {}

    async createManyBlogs() {

        for (let i = 0; i < this.numberBlogs; i++) {
            const blog = {name: `Blog_${i}`,
                            description: `description for blog ${i}`,
                            websiteUrl:	`https://dff${i}.com`  }
            const newBlog: BlogDocument = this.BlogModel.createInstance(blog);
            await newBlog.save()
            this.blogs.push(newBlog);
        }
    }

    async createManyPosts(){
        // create many posts for blog with id in this.blogIds[0]

        await this.createManyBlogs();
        for(let i = 0; i < this.numberPosts; i++){
            const post ={
                title: `post ${i}`,
                shortDescription: `shortdescription for post ${i}`,
                content: `content for post ${i}`,
                blogId: this.blogs[0]._id.toString(),
            };
            const newPost: PostDocument
                = await this.PostModel.createInstance(post, this.blogs[0].name);
            await newPost.save();
            this.posts.push(newPost);
        }
    }

    async createManyUsers(){

        for(let i =0; i < this.numberUsers; i++){
            const user = {
                login: `lhfg_${i}`,
                email: `gh2_${i}@test.com`,
                password: `paSSword_${i}`
            }
            const newUser: UserDocument = await this.UserModel.createInstance(user);
            await newUser.save();
            this.users.push(newUser);

            // const token = await request(this.app.getHttpServer())
            //     .post(`${URL_PATH.auth}${AUTH_PATH.login}`)
            //     .send({
            //         "loginOrEmail": this.users[i].login,
            //         "password":     this.users[i].password
            //     })
            // expect(token.body).toHaveProperty("accessToken");
            // expect(typeof token.body.accessToken).toBe('string');
            //
            // this.accessTokens.push(token.body.accessToken)
        }}

    async createManyComment(){
        await this.createManyPosts();
        await this.createManyUsers();
        for(let i =0; i < this.numberComments; i++){
            const comment: CreateCommentDto =
                {content: `This is the comment number ${i}`,
                 postId: this.posts[0]._id.toString(),
                 userId: this.users[0]._id.toString(),
                 login: this.users[0].login};
            const newComment: CommentDocument = await this.CommentModel.createInstance(comment)
            await newComment.save();
            this.comments.push(newComment)
        }
    }

    // createTitleDevices(){
    //     this.titleDevices = ['Chrome 12', 'Chrome 34', 'Android 17', 'Android 5', 'IoS 6']
    // }
    // createBadUser(){
    //     this.badUser = {
    //         login: 'lhfg',
    //         email: 'gh2@test.com',
    //         password: 'paSS'
    //     }
    // }

    static async createTestData(app: INestApplication,
                                userConfig: UserConfig,
                                BlogModel: BlogModelType,
                                PostModel: PostModelType,
                                CommentModel: CommentModelType,
                                UserModel: UserModelType,
                                numberUsers : number = 1,
                                numberBlogs: number = 1,
                                numberPosts : number = 1,
                                numberComments : number = 1,
    ):Promise<TestDataBuilderByDb>{
        if(numberBlogs < 1 || numberUsers < 1 || numberPosts < 1 || numberComments < 1){
            throw new Error("Invalid number of entity");
        }
        const testData = new this(app, BlogModel, PostModel, CommentModel, UserModel,
            numberUsers, numberBlogs, numberPosts, numberComments);
        testData.authLoginPassword = AuthBasic.createAuthHeader(userConfig)

        await testData.createManyBlogs();
        // создаем блоги и сохраняем их ИД в массив
        await testData.createManyPosts();
        // создаем посты для 0 блога и сохраняем их ИД в массив
        await testData.createManyUsers();
        // создаем юзеров и сохраняем в массив для каждого из них аксесс токен
        await testData.createManyComment();
        // создаем комменты для 0 поста и сохраняем их ИД в массив
        return testData;
    }
}
