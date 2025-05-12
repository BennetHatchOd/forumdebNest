// import request from "supertest";
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// import { app } from "../../../../../2024/Node/forumdeb/src/app";
// import { testSeeder } from "../../../../../2024/Node/forumdeb/__test__/e2e/common/test.seeder";
// import { UserInputType } from "../../../../../2024/Node/forumdeb/src/variety/users/types";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import { CommentInputType } from "../../../../../2024/Node/forumdeb/src/variety/comments/types";
// import { PostInputType } from "../../../../../2024/Node/forumdeb/src/variety/posts/types";
// import { BlogInputType } from "../../../../../2024/Node/forumdeb/src/variety/blogs/types";
// import { fillSystem } from "../../../../../2024/Node/forumdeb/__test__/e2e/common/fillSystem";
// import { Rating } from "../../../../../2024/Node/forumdeb/src/variety/likes/types";
// import { setEntityLike} from "../../../../../2024/Node/forumdeb/__test__/e2e/common/helper";
// import { HTTP_STATUSES, mongoURI, URL_PATH } from "../../../../../2024/Node/forumdeb/src/setting/setting.path.name";
// import { AuthPassword } from "../../../../../2024/Node/forumdeb/__test__/e2e/common/test.setting";
//
// describe('/likes', () => {
//
//     //let server:  MongoMemoryServer
//     let uri : string
//
//      jest.setTimeout(35000)
//
//     beforeAll(async() =>{  // clear db-array
//
//         //server = await MongoMemoryServer.create()
//         //uri = server.getUri()
//         uri = mongoURI
//
//         await mongoose.connect(uri)
//         await request(app).delete('/testing/all-data')
//
//
//     })
//
//     afterAll(async() =>{
//         await mongoose.connection.close()
//     //    await server.stop()
//     })
//
//     let postsId: string[] = []
//     let users: Array<UserInputType> = testSeeder.createManyGoodUsers(8)
//     let userLikes: {userId: string, login: string, addedAt: string}[] = []
//     let accessToken: Array<string> = []
//     let commentsId: Array<string> = []
//     let comments: Array<CommentInputType> = testSeeder.createManyComment(4)
//     let posts: Array<PostInputType> = testSeeder.createManyPostsForBlog("", 6)
//     let blogs: Array<BlogInputType> = testSeeder.createManyBlogs(2)
//
//     it('Create system of blog, post and comments', async() => {
//
//         await fillSystem(blogs, posts, users, comments, accessToken, commentsId, postsId, userLikes)
//         const postResponce = await request(app)
//                                     .get(`${URL_PATH.posts}/${postsId[0]}`)
//                                     .set("Authorization", 'Bearer ' + accessToken[1])
//                                     .expect(HTTP_STATUSES.OK_200);
//         const post = postResponce.body
//         expect(post).toEqual(   {id: expect.any(String),
//                                 title: posts[0].title,
//                                 shortDescription: posts[0].shortDescription,
//                                 content: posts[0].content,
//                                 createdAt: expect.any(String),
//                                 blogId: posts[0].blogId,
//                                 blogName: blogs[0].name,
//                                 extendedLikesInfo: {
//                                     likesCount: 0,
//                                     dislikesCount: 0,
//                                     myStatus: "None",
//                                     newestLikes: []
//                                 }})
//     })

    // it('Check like and dislike for one post', async() => {  
        
    //     let status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
    //                                                                                                 dislikesCount: 0,
    //                                                                                                 myStatus: status,
    //                                                                                                 newestLikes: [userLikes[1]] })
    //     status = Rating.Dislike
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 0,
    //                                                                                                 dislikesCount: 1,
    //                                                                                                 myStatus: status,
    //                                                                                                 newestLikes: [] })

    //     status = Rating.None
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 0,
    //                                                                                                 dislikesCount: 0,
    //                                                                                                 myStatus: status,
    //                                                                                                 newestLikes: [] })

    //     status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
    //                                                                                                 dislikesCount: 0,
    //                                                                                                 myStatus: status,
    //                                                                                                 newestLikes: [userLikes[1]] })
    //     status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
    //                                                                                                 dislikesCount: 0,
    //                                                                                                 myStatus: status,
    //                                                                                                 newestLikes: [userLikes[1]] })
    //     status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[1], status)).toEqual({ likesCount: 1,
    //                                                                                                 dislikesCount: 0,
    //                                                                                                 myStatus: status,
    //                                                                                                 newestLikes: [userLikes[1]] })                                                                                            
    // })
                                                                                            
    // it('An unauthorized user is viewing the post status', async() => { 

    //     const postResponce = await request(app)
    //                                   .get(`${URL_PATH.posts}/${postsId[0]}`)
    //                                   .expect(HTTP_STATUSES.OK_200);
    //     const post = postResponce.body                
    //     expect(post.extendedLikesInfo).toEqual({    likesCount: 1,
    //                                      dislikesCount: 0,
    //                                           myStatus: Rating.None,
    //                                        newestLikes: [userLikes[1]]})    
    // })

    // it('Some users like and dislike post', async() => {

    //     let status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[0], status)).toEqual({ likesCount: 2,
    //                                                                                     dislikesCount: 0,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[0], userLikes[1]] })
    //     status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[2], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 0,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[2], userLikes[0], userLikes[1]] })
    //     status = Rating.Dislike
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[3], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 1,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[2], userLikes[0], userLikes[1]] })
        
       
    //     status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[4], status)).toEqual({ likesCount: 4,
    //                                                                                     dislikesCount: 1,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[4], userLikes[2], userLikes[0]] })

       
    //     status = Rating.None
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[5], status)).toEqual({ likesCount: 4,
    //                                                                                     dislikesCount: 1,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[4], userLikes[2], userLikes[0]] })
                            
      
    //     status = Rating.Dislike
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[2], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 2,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[4], userLikes[0], userLikes[1]] })
    //     status = Rating.Like
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[6], status)).toEqual({ likesCount: 4,
    //                                                                                     dislikesCount: 2,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[6], userLikes[4], userLikes[0]] })
    //    status = Rating.None
    //     expect(await setEntityLike(URL_PATH.posts, postsId[0], accessToken[6], status)).toEqual({ likesCount: 3,
    //                                                                                     dislikesCount: 2,
    //                                                                                     myStatus: status,
    //                                                                                     newestLikes: [userLikes[4], userLikes[0], userLikes[1]] })
    // })

    // it('Some users like and dislike posts', async() => {

    //     let status = Rating.Like
    //     let users = [[1, 3, 4, 5, 6 ,7],
    //                  [2, 3, 4],
    //                  [2, 5]
    //                 ]
    //     for(let i = 0; i < 3; i++){            
    //         for (let user of users[i]){
    //             await setEntityLike(URL_PATH.posts, postsId[i+1], accessToken[user], status)
    //         }
    //     }

    //     status = Rating.Dislike

    //     users = [[2],
    //              [1, 5, 6],
    //              [1, 2, 3, 4, 4, 5, 6]
    //             ]
    //     for(let i = 0; i < 3; i++){            
    //         for (let user of users[i]){
    //             await setEntityLike(URL_PATH.posts, postsId[i+1], accessToken[user], status)
    //         }
    //     }

    //     status = Rating.None
    //     users = [[3],
    //              [6, 1],
    //              []
    //             ]
    //     for(let i = 0; i < 3; i++){            
    //         for (let user of users[i]){
    //             await setEntityLike(URL_PATH.posts, postsId[i+1], accessToken[user], status)
    //         }
    //     }
    
    //     let postResponce = await request(app).get(`${URL_PATH.posts}/${postsId[0]}`).set("Authorization", 'Bearer ' + accessToken[2])
    //     expect(postResponce.body.extendedLikesInfo).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 2,
    //                                                     myStatus: Rating.Dislike ,
    //                                                     newestLikes: [userLikes[4], userLikes[0], userLikes[1]] })

    //     postResponce = await request(app).get(`${URL_PATH.posts}/${postsId[1]}`).set("Authorization", 'Bearer ' + accessToken[3])
    //     expect(postResponce.body.extendedLikesInfo).toEqual({ likesCount: 5,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.None,
    //                                                     newestLikes: [userLikes[7], userLikes[6], userLikes[5]]  })

    //     postResponce = await request(app).get(`${URL_PATH.posts}/${postsId[2]}`).set("Authorization", 'Bearer ' + accessToken[4])
    //     expect(postResponce.body.extendedLikesInfo).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.Like,
    //                                                     newestLikes: [userLikes[4], userLikes[3], userLikes[2]]  })

    //     postResponce = await request(app).get(`${URL_PATH.posts}/${postsId[3]}`).set("Authorization", 'Bearer ' + accessToken[5])
    //     expect(postResponce.body.extendedLikesInfo).toEqual({ likesCount: 0,
    //                                                     dislikesCount: 6,
    //                                                     myStatus: Rating.Dislike,
    //                                                     newestLikes: []  })

    //     postResponce = await request(app).get(`${URL_PATH.posts}/${postsId[1]}`)
    //     expect(postResponce.body.extendedLikesInfo).toEqual({ likesCount: 5,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.None,
    //                                                     newestLikes: [userLikes[7], userLikes[6], userLikes[5]]  })
    // })

    //     it('Get all posts', async() => {

    //     let postResponce = await request(app).get(`${URL_PATH.blogs}/${posts[0].blogId}/posts`)
    //                                             .set("Authorization", 'Bearer ' + accessToken[2])
        
 b
    //     expect(postResponce.body.items[0].extendedLikesInfo).toEqual({ likesCount: 0,
    //                                                     dislikesCount: 0,
    //                                                     myStatus: Rating.None  ,
    //                                                     newestLikes: [] })
    //     expect(postResponce.body.items[1].extendedLikesInfo).toEqual({ likesCount: 0,
    //                                                     dislikesCount: 0,
    //                                                     myStatus: Rating.None  ,
    //                                                     newestLikes: [] })

    //     expect(postResponce.body.items[2].extendedLikesInfo).toEqual({ likesCount: 0,
    //                                                     dislikesCount: 6,
    //                                                     myStatus: Rating.Dislike,
    //                                                     newestLikes: []})

    //     expect(postResponce.body.items[5].extendedLikesInfo).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 2,
    //                                                     myStatus: Rating.Dislike  ,
    //                                                     newestLikes: [userLikes[4], userLikes[0], userLikes[1]] })

    //     expect(postResponce.body.items[4].extendedLikesInfo).toEqual({ likesCount: 5,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.Dislike,
    //                                                     newestLikes: [userLikes[7], userLikes[6], userLikes[5]] })   

    //     expect(postResponce.body.items[3].extendedLikesInfo).toEqual({ likesCount: 3,
    //                                                     dislikesCount: 1,
    //                                                     myStatus: Rating.Like,
    //                                                     newestLikes: [userLikes[4], userLikes[3], userLikes[2]]  })


    // })
// })


