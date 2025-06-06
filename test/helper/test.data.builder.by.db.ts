import { INestApplication, Inject } from '@nestjs/common';
import { AuthBasic } from './auth.basic';
import { UserConfig } from '@src/modules/users-system/config/user.config';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '@src/modules/blogging.platform/domain/blog.entity';
import { Post, PostDocument, PostModelType } from '@src/modules/blogging.platform/domain/post.entity';
import { Comment, CommentDocument, CommentModelType } from '@src/modules/blogging.platform/domain/comment.entity';
import { CreateCommentDto } from '@modules/blogging.platform/dto/create/create.comment.dto';
import { PasswordHashService } from '@src/modules/users-system/application/password.hash.service';
import request from 'supertest';
import { join } from 'path';
import { AUTH_PATH, URL_PATH } from '@core/url.path.setting';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';
import { User } from '@modules/users-system/domain/user.entity';
import console from 'node:console';

export class TestDataBuilderByDb {
    // создаем первоначальное наполнение системы
    accessTokens: string[] = [];
    users: User[] = [];
    usersPassword: string[] = [];
    comments: CommentDocument[] = [];
    blogs: BlogDocument[] = [];
    posts: PostDocument[] = [];
    authLoginPassword: string = '';
    usersLikes: {addedAt: string,
                userId: string,
                login: string}[] = []
    private isCreate = {
        blog: false,
        post: false,
        comment: false,
        user: false,
    }

    constructor(private app:INestApplication,
                @InjectModel(Blog.name)private BlogModel: BlogModelType,
                @InjectModel(Post.name)private PostModel: PostModelType,
                @InjectModel(Comment.name)private CommentModel: CommentModelType,
                @Inject(DATA_SOURCE)private readonly dataSource: DataSource,
                public passwordHashService: PasswordHashService,
                public userConfig: UserConfig,
                public numberUsers : number = 1,
                public numberBlogs: number = 1,
                public numberPosts : number = 1,
                public numberComments : number = 1,
    ) {}

    async createManyBlogs() {
        this.isCreate.blog = true;

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
        await this.checkBlog();
        this.isCreate.post = true;

        for(let i = 0; i < this.numberPosts; i++){
            const post ={
                title: `post ${i}`,
                shortDescription: `shortdescription for post ${i}`,
                content: `content for post ${i}`,
                blogId: this.blogs[0]._id.toString(),
            };
            const newPost: PostDocument
                = this.PostModel.createInstance(post, this.blogs[0].name);
            await newPost.save();
            this.posts.push(newPost);
        }
    }

    async createManyUsers(){
        this.isCreate.user = true;
        for(let i =0; i < this.numberUsers; i++){
            const user = {
                login: `lhfg_${i}`,
                email: `gh2_${i}@test.com`,
                password: `paSSword_${i}`
            }
            this.usersPassword.push(user.password)
            user.password = await this.passwordHashService.createHash(
                user.password,
                this.userConfig.saltRound,
            );
            const newUser: User = User.createInstance(user, true);

            const result = await this.dataSource.query(`
                INSERT INTO public."Users"(
                    login, email, "passwordHash")
                VALUES('${user.login}', '${user.email}', '${user.password}')
                RETURNING id;`)
            newUser.id = result[0].id;
            this.users.push(newUser);
            this.usersLikes.push({
                addedAt: expect.any(String),
                userId: newUser.id!.toString(),
                login: user.login,})
        }
    }

    async createManyAccessTokens(){
        if(!this.isCreate.user)
            await this.createManyUsers();

        for(let i =0; i < this.numberUsers; i++) {

            const token = await request(this.app.getHttpServer())
                .post(join(URL_PATH.auth, AUTH_PATH.login))
                .send({
                    "loginOrEmail": this.users[i].login,
                    "password": this.usersPassword[i]
                })
            this.accessTokens.push(token.body.accessToken)
        }
    }
    async createManyComment(){
        this.isCreate.comment = true;
        await this.checkPost()
        await this.checkUser();

        for(let i =0; i < this.numberComments; i++){
            const comment: CreateCommentDto =
                {content: `This is the comment number ${i}`,
                 postId: this.posts[0]._id.toString(),
                 userId: this.users[0].id.toString(),
                 login: this.users[0].login};
            const newComment: CommentDocument = this.CommentModel.createInstance(comment)
            await newComment.save();
            this.comments.push(newComment)
        }
    }

    clearData(){
        this.users = [];
        this.usersPassword = [];
        this.comments = [];
        this.blogs = [];
        this.posts = [];
        this.accessTokens = [];
        this.usersLikes =[];

        this.isCreate = {
            blog: false,
            post: false,
            comment: false,
            user: false,
        }

    }

    // createTitleSessions(){
    //     this.titleSessions = ['Chrome 12', 'Chrome 34', 'Android 17', 'Android 5', 'IoS 6']
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
                                dataSource: DataSource,
                                passwordHashService: PasswordHashService,
    ):Promise<TestDataBuilderByDb>{
        const testData = new this(app, BlogModel, PostModel, CommentModel, dataSource,
            passwordHashService, userConfig);
        testData.authLoginPassword = AuthBasic.createAuthHeader(userConfig)

        return testData;
    }

    private async checkBlog(){
        if (!this.isCreate.blog) {
            await this.createManyBlogs();
            this.isCreate.blog = true;
        }
    }
    private async checkPost(){
        if(!this.isCreate.post){
            await this.createManyPosts();
            this.isCreate.post = true;
        }
    }
    private async checkUser(){
        if(!this.isCreate.user) {
            await this.createManyAccessTokens();
            this.isCreate.user = true;
        }
    }
}
