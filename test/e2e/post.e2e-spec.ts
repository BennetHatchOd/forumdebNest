import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import {  URL_PATH } from '@core/url.path.setting';
import { initSettings } from '../helper/init.settings';
import { TestDataBuilderByDb } from '../helper/test.data.builder.by.db';
import { join } from 'path';
import { deleteAllData } from '../helper/delete.all.data';
import { INJECT_TOKEN } from '@core/constans/jwt.tokens';
import { UserConfig } from '@src/modules/users-system/config/user.config';
import { JwtService } from '@nestjs/jwt';
import { defaultUserConfig } from '../helper/default.user.config';
import { PostInputDto } from '@modules/blogging.platform/dto/input/post.input.dto';
import console from 'node:console';

describe('PostController (e2e)', () => {
    let app: INestApplication;
    let testData: TestDataBuilderByDb;
    let globalPrefix;
    let post;
    let postByBlog;

    beforeAll(async () => {
        const result
            = await initSettings((moduleBuilder) =>
            moduleBuilder
                .overrideProvider(INJECT_TOKEN.ACCESS_TOKEN)
                .useFactory({
                    factory: (userConfig: UserConfig) => {
                        return new JwtService({
                            secret: userConfig.accessTokenSecret,
                            signOptions: { expiresIn: '2s' },
                        });
                    },
                    inject: [UserConfig],
                })
                .overrideProvider(UserConfig).useValue({
                ...defaultUserConfig,
                timeRateLimiting: 10000,
                countRateLimiting: 55,
            })
        );
        app = result.app;
        testData = result.testData;
        globalPrefix = result.globalPrefix;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Testing simple CRUD posts.', () => {
        post = {
            title: "title",
            shortDescription: "shortDescription",
            content: "content",
            blogId: "1"
        }
        postByBlog = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
        }
        let postId: string;
        let postId2: string;
        beforeAll(async () => {
            await deleteAllData(app, globalPrefix);
            testData.clearData();
            testData.numberBlogs = 2;
            await testData.createManyBlogs();
            post.blogId = testData.blogs[0].id!.toString();
        })

        afterAll(async () => {
        })

        it('should return 201 and a created post by PostControler', async () => {

            const response = await request(app.getHttpServer())
                .post(URL_PATH.posts)
                .set("Authorization", testData.authLoginPassword)
                .send(post)
                .expect(HttpStatus.CREATED)
            expect(response.body).toEqual({
                id: expect.any(String),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                createdAt: expect.any(String),
                blogName: testData.blogs[0].name,
                blogId: testData.blogs[0].id!.toString(),
                extendedLikesInfo: expect.any(Object),
            })
            postId = response.body.id;
        });

        it('should return 201 and a created post by BlogControler', async () => {

            const response = await request(app.getHttpServer())
                .post(join(URL_PATH.blogs,testData.blogs[0].id!.toString(),'posts'))
                .set("Authorization", testData.authLoginPassword)
                .send(postByBlog)
                .expect(HttpStatus.CREATED)
            expect(response.body).toEqual({
                id: expect.any(String),
                title: postByBlog.title,
                shortDescription: postByBlog.shortDescription,
                content: postByBlog.content,
                createdAt: expect.any(String),
                blogName: testData.blogs[0].name,
                blogId: testData.blogs[0].id!.toString(),
                extendedLikesInfo: expect.any(Object),
            })
            postId2 = response.body.id;
        });

        it('should return 200 and the found posts', async () => {
            const response = await request(app.getHttpServer())
                .get(join(URL_PATH.postsQuery, postId))
                .expect(HttpStatus.OK)
            expect(response.body).toEqual({
                id: postId,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                createdAt: expect.any(String),
                blogName: testData.blogs[0].name,
                blogId: testData.blogs[0].id!.toString(),
                extendedLikesInfo: expect.any(Object),
            })
            const response2 = await request(app.getHttpServer())
                .get(join(URL_PATH.postsQuery, postId2))
                .expect(HttpStatus.OK)
            expect(response2.body).toEqual({
                id: postId2,
                title: postByBlog.title,
                shortDescription: postByBlog.shortDescription,
                content: postByBlog.content,
                createdAt: expect.any(String),
                blogName: testData.blogs[0].name,
                blogId: testData.blogs[0].id!.toString(),
                extendedLikesInfo: expect.any(Object),
            })

        })

        it('should return 204 and 200 after check editing post', async () => {
            post = {
                title: "jkggfd",
                shortDescription: "khgfgP",
                content: "https://google.net",
                blogId: testData.blogs[1].id!.toString(),
            }
            await request(app.getHttpServer())
                .put(join(URL_PATH.posts, postId))
                .set("Authorization", testData.authLoginPassword)
                .send(post)
                .expect(HttpStatus.NO_CONTENT)

            const response = await request(app.getHttpServer())
                .get(join(URL_PATH.postsQuery, postId))
                .expect(HttpStatus.OK)
            expect(response.body).toEqual({
                id: postId,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                createdAt: expect.any(String),
                blogName: testData.blogs[1].name,
                blogId: testData.blogs[1].id!.toString(),
                extendedLikesInfo: expect.any(Object),
            })
        })

        it('should return 204 after deleting and 404 after get this post', async () => {
            await request(app.getHttpServer())
                .delete(join(URL_PATH.blogs, postId2))
                .set("Authorization", testData.authLoginPassword)
                .expect(HttpStatus.NO_CONTENT)
            const response = await request(app.getHttpServer())
                .get(join(URL_PATH.blogsQuery, postId2))
                .expect(HttpStatus.NOT_FOUND)
        })

    })

    describe('Testing paginator for posts', () => {
        const posts = [
            {
                title: "nalo3aLk",
                shortDescription: "string2",
                content: "https://google.com",
                blogId: "3",
            },
            {
                title: "f3Alnalo3aLm",
                shortDescription: "stri",
                content: "https://google1.com",
                blogId: "3",
            },
            {
                title: "F3pa3alnar",
                shortDescription: "strigtng2",
                content: "https://google2.com",
                blogId: "3",
            },
            {
                title: "fF3pa3alnar",
                shortDescription: "strigtng2",
                content: "https://google2.com",
                blogId: "3",
            },
            {
                title: "f3ALHtT",
                shortDescription: "fgh3AhLHtT",
                content: "https://google3.com",
                blogId: "3",
            },
        ];
        let pagesCount: number;
        let page: number;
        let pageSize: number;
        let totalCount: number;

        beforeAll(async () => {
            await deleteAllData(app, globalPrefix);
            testData.clearData();
            testData.numberPosts = 10;
            testData.numberBlogs = 3;
            await testData.createManyPosts();
            pagesCount = Math.floor((posts.length + testData.numberPosts - 1) / 10) + 1;
            page = 1;
            pageSize = 10;
            totalCount = posts.length + testData.numberPosts;
            posts.forEach((post) => {
                post.blogId = testData.blogs[1].id!.toString();
            })
            await testData.writeToDB<PostInputDto>(posts, 'posts')
        })

        afterAll(async () => {
        })

        it('should return 200 and a default paginator', async () => {
            const response = await request(app.getHttpServer())
                .get(URL_PATH.postsQuery)
                .expect(HttpStatus.OK)

            expect(response.body).toEqual({
                pagesCount: pagesCount,
                page: page,
                pageSize: pageSize,
                totalCount: totalCount,
                items: expect.any(Array)
            });
            expect(response.body.items[0]).toEqual({
                id: expect.any(String),
                title: posts.at(-1)!.title,
                shortDescription: posts.at(-1)!.shortDescription,
                content: posts.at(-1)!.content,
                createdAt: expect.any(String),
                blogName: testData.blogs[1].name,
                blogId: posts.at(-1)!.blogId.toString(),
                extendedLikesInfo: expect.any(Object),
            })

        })

        it('should return 200 and a paginator with pageSize, pageNumber ', async () => {
            const response = await request(app.getHttpServer())
                .get(URL_PATH.postsQuery)
                .query({
                    pageSize: 4,
                    pageNumber: 11
                })
                .expect(HttpStatus.OK)
            expect(response.body).toEqual({
                pagesCount: 4,
                page: 4,
                pageSize: 4,
                totalCount: totalCount,
                items: expect.any(Array)
            })
            expect(response.body.items.length).toBe(3)
        })

        it('should return 200 and a paginator with sort by title', async () => {
            const response = await request(app.getHttpServer())
                .get(join(URL_PATH.blogsQuery,testData.blogs[1].id!.toString(), 'posts'))
                .query({
                    pageSize: 11,
                    pageNumber: 6,
                    sortBy: 'title',
                    sortDirection: 'asc'
                })
                .expect(HttpStatus.OK);
            expect(response.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 11,
                totalCount: 5,
                items: expect.any(Array)
            });
            expect(response.body.items.length).toBe(5)
            const names = response.body.items.map(item => item.title);
            expect(names).toEqual(
               // ['F3pa3alnar', 'f3ALztT', 'f3Alnalo3aLm', 'nalo3aLk'])
                 ["F3pa3alnar", "f3ALHtT", "f3Alnalo3aLm", "fF3pa3alnar", "nalo3aLk"]);
        })
    })

    describe('Testing create, edit and delete blogs with some wrongs', () => {
        const post = {
                title: "nalo3aLk",
                shortDescription: "string2",
                content: "https://google.com",
                blogId: "3",
        }

        beforeAll(async () => {
            testData.clearData();
            testData.numberPosts = 1;
            await testData.createManyPosts();
            await deleteAllData(app, globalPrefix);
        })

        afterAll(async () => {
        })

        it('should return 400 if we send wrong content', async () => {
            const response = await request(app.getHttpServer())
                .post(URL_PATH.posts)
                .set("Authorization", testData.authLoginPassword)
                .send({
                    title: "n12345678901234567890123456789",
                    shortDescription: "string2",
                    content: "https://google.com",
                    blogId: "752"})
                .expect(HttpStatus.BAD_REQUEST)
            console.log(response.body.errorsMessages)
            expect(response.body.errorsMessages.length).toBe(2)
            expect(response.body.errorsMessages).toEqual([{
                  message: expect.any(String),
                  field: "title"
                },
                {
                  message: expect.any(String),
                  field: "blogId"
                }])
        })

        it('should return 401 if user not authorization', async () => {
            await request(app.getHttpServer())
                .post(URL_PATH.posts)
                .send(post)
                .expect(HttpStatus.UNAUTHORIZED)
        })

        it('should return 404 if post not exist', async () => {
            await request(app.getHttpServer())
                .put(join(URL_PATH.posts, "2jh45"))
                .set("Authorization", testData.authLoginPassword)
                .send(post)
                .expect(HttpStatus.NOT_FOUND)

        })
    })
})