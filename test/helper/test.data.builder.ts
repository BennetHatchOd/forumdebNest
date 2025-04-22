import { UserInputDto } from '../../src/modules/users-system/dto/input/user.input.dto';
import { CommentInputDto } from '../../src/modules/blogging.platform/dto/input/comment.input.dto';
import { BlogInputDto } from '../../src/modules/blogging.platform/dto/input/blog.input.dto';
import { PostInputDto } from '../../src/modules/blogging.platform/dto/input/post.input.dto';
import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AUTH_PATH, URL_PATH } from '../../src/core/url.path.setting';
import { AuthBasic } from './auth.basic';
import { CoreConfig } from '../../src/core/core.config';

export class TestDataBuiler {
    users: UserInputDto[] = [];
    accessTokens: string[] = [];
    // badUser: UserInputDto;
    // titleDevices: string[];
    comments: CommentInputDto[] = [];
    blogs: BlogInputDto[] = [];
    blogIds: string[] = [];
    postIds: string[] = [];
    commentIds: string[] = [];
    posts: PostInputDto[] = [];
    authLoginPassword: string;// = "Basic YWRtaW46cXdlcnR5";



    constructor(private app:INestApplication) {}

    private prepareManyBlogs(numberBlogs: number = 1){

        for(let i = 0; i < numberBlogs; i++)
            this.blogs.push({name: `Blog_${i}`,
                        description: `description for blog ${i}`,
                        websiteUrl:	`https://dff${i}.com`  })
    }

    async createManyBlogs(numberBlogs: number = 1){
        this.prepareManyBlogs(numberBlogs);

        for(let i = 0; i < numberBlogs; i++) {
            const blogCreate = await request(this.app.getHttpServer())
                .post(URL_PATH.blogs)
                .set("Authorization", this.authLoginPassword)
                .send(this.blogs[0])
                .expect(HttpStatus.CREATED)
            this.blogIds.push(blogCreate.body.id);
        }
    }

    private prepareManyPosts(blogId: string, numberPosts: number = 1){

        for(let i = 0; i < numberPosts; i++)
            this.posts.push({title:        `post ${i}`,
                        shortDescription:   `shortdescription for post ${i}`,
                        content:	        `content for post ${i}`,
                        blogId:             blogId })
    }

    async createManyPosts(numberPosts: number = 1){
        // create many posts for blog with id in this.blogIds[0]
        this.prepareManyPosts(this.blogIds[0], numberPosts);

        for(let i = 0; i < numberPosts; i++){
            const postCreate = await request(this.app.getHttpServer())
                .post(URL_PATH.posts)
                .set("Authorization", this.authLoginPassword)
                .send(this.posts[i])
                .expect(HttpStatus.CREATED)
            this.postIds.push(postCreate.body.id)
        }
    }

    private prepareManyUsers(numberUsers: number = 1){

        for(let i = 0; i < numberUsers; i++)
            this.users.push({login: `lhfg_${i}`,
                        email: `gh2_${i}@test.com`,
                        password: `paSSword_${i}`
        })
    }

    async createManyUsers(numberUsers: number = 1){
        this.prepareManyUsers(numberUsers);

        for(let i =0; i < numberUsers; i++){
            const f = await request(this.app.getHttpServer())
                .post(`${URL_PATH.users}`)
                .set("Authorization", this.authLoginPassword)
                .send(this.users[i])
                .expect(HttpStatus.CREATED);

             // userLikes.push({userId: userCreate.body.id,
            //     login:  userCreate.body.login,
            //     addedAt:  expect.any(String)})

            const token = await request(this.app.getHttpServer())
                .post(`${URL_PATH.auth}${AUTH_PATH.login}`)
                .send({
                    "loginOrEmail": this.users[i].login,
                    "password":     this.users[i].password
                })
                expect(typeof token.body.accessToken).toBe('string');
            // await new Promise((resolve) => {setTimeout(resolve, 2000)})
            // задержка если есть ограничения на количество обращений к ендпоинту с одного IP
            // в промежуток времени
            this.accessTokens.push(token.body.accessToken)
    }}

    private prepareManyComment(numberComments: number = 1){
        for(let i = 0; i < numberComments; i++)
            this.comments.push({content: `This is the comment number ${i}`})
    }

    async createManyComment(numberComments: number = 1){
        // create many posts by user[0] and user[1] for blog with id in this.postIds[0]
        //
        this.prepareManyComment(numberComments);
        for(let i =0; i < numberComments; i++){
            const s = `${URL_PATH.posts}/${this.postIds[0]}/comments`;
            const commentCreate = await request(this.app.getHttpServer())
                .post(s)
                .set("Authorization", 'Bearer ' + this.accessTokens[i % 2])
                .send(this.comments[i])
                .expect(HttpStatus.CREATED);

            this.commentIds.push(commentCreate.body.id)
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
                                coreConfig: CoreConfig):Promise<TestDataBuiler>{
        const testData = new this(app);
        testData.authLoginPassword = AuthBasic.createAuthHeader(coreConfig)

        await testData.createManyBlogs(2);
        // создаем блоги и сохраняем их ИД в массив
        await testData.createManyPosts(4);
        // создаем посты для 0 блога и сохраняем их ИД в массив
        await testData.createManyUsers(8);
        // создаем юзеров и сохраняем в массив для каждого из них аксесс токен
        await testData.createManyComment(8);
        // создаем комменты для 0 поста и сохраняем их ИД в массив
        return testData;
    }
}
