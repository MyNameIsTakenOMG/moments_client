# Welcome to Moments(Front end) !

## Introduction

This is the front end part of the project **Moments**.

**Moments** is a personal project that follows the footsteps of one of the best social medias in the industry, [Twitter](https://twitter.com)  by mimicking some functionalities of **Twitter**.
![Moments-demo](https://github.com/MyNameIsTakenOMG/project-gifs/blob/main/Moments-demo.gif)
The link of the app : [Demo](https://www.momentsapp.zhengfangdev.com/login)

**Note** : Using a makeup email address when registering a new account is recommended, please follow email address format `xxx@xxx.xxx`, or you can use a testing account to give it a shot:
Account: `test1@test.com`
Password: `test1`

## Features

**Moments** is a social media web application which is  following the good example set by **Twitter** which is one of the best social medias in the industry. The main functionalities that *Moments* includes are :

 - Users can choose to sign in with their `Google accounts` or register a new account. Also, if a user forgot his or her password, then they can request a `password resetting email` by typing their email address.
 - Users can create their own posts. Also, they can update their posts as well as delete posts. **Please** **note** : if a user choose to *delete* his or her post(s), all comments associated with the post(s), including nested comments will be gone, cannot be restored. 
 - Users can comment on others' posts or comments. And similar to posts, users can update their comments, even delete their comments. **Please note** : like deleting post(s), when deleting comments, all associated comments will be deleted as well, the operation cannot be reversed.
 - Users can choose whom they want to follow or subscribe, then by clicking the `Follow` button on the left side of the page, they will be presented with a list of posts written by the users they are following. Also, they can choose to unfollow any of those users at any time.
 - With the help of **MongoDB Atlas Search**, users now are able to perform `full-text` search with `fuzzy` feature to search for any users or posts they are interested in.
 - By taking advantage of combination of **Redis** and **Socket IO**,  we can track user's online status, which is very useful when it comes to send notifications to users. When a user received a new comment or a like, and if we can find this user in our redis store, then it means this user is online and we can use socketio send a notification to this user.


## Issues and challenges
- To deal with operations `updating` and `deleting` need extra overheads. Because every `updating` or `deleting` operation could influence multiple documents. Especially, when dealing with `deleting` operation, the issue I faced was to find out all associated documents. For example, when deleting a `post`, I also want to delete all comments related to it directly or indirectly, and it can be very cumbersome to look at those comments one by one to see which comments they have, it could mean you have to go through very nested iteration to complete this `deleting` operation. **Solution** : adding a `path` property to each comment document, a path format is: `{postId}/{comment1_id}/{childComment1_id}/...`, then I can just delete any comment as long as its path matches the `id` of the post I want to delete.
- To demonstrate nested `comments` sections for any post as well as its comments can be tricky, especially on screens with small sizes, because there won't be enough space show those comments. **Workaround** : for each `post` or `comment`, only `direct` comments or its own `comments` section will be shown on the page, while for the nested comments, users need to click that specific comment to take a look. **Cons** : users need to go deeply to check those nested comments. Also, it can be troublesome for users to go back and forth between different `post` pages or `comment` pages, which leads to relatively bad user experience.
- Lack relevant knowledge and experience to either set up listener to listen to any changes made to the posts or comments fetched and shown on the page or implement `long pooling` like **Twitter** to fetch the latest data for users without making them refresh the page by themselves.  **Workaround** : each time when a user clicks the like button or leaves a comment, except showing notification bar, I will also give them feedback once the data stored in the database has been updated successfully by updating the data stored in the `redux store` at the front end. For example, if someone leaves a comment, then the number of the comments will be incremented by 1, so in this way, the user experience will be improved a bit, even though they still need to refresh the page to get the up-to-date data.  


# Technologies

 - React.js
 - Express.js
 - MongoDB Atlas
 - Mongoose.js
 - Socket.IO
 - Redis
 - Cloudinary
 - SendGrid
 - Material UI
 - Redux toolkit
 - React router
 - JOI
 - React helmet
 - Javascript

## Get Started

This is the part showing how to get a local copy up and running. Please follow the steps:

**Prerequisites**

Please make sure **Node.js** has been downloaded and installed globally. The download link:  [Node.js](https://nodejs.org/en/download/)

**Start the development server**

Run the command: `npm start` to test the site on `localhost:3000`

**Environment variables**

In the `env.example` file, there are several variables that need to be setup first. 
Firstly, for `google client ID`, please go to [Sign in with Google](https://cloudinary.com/) to read the instructions and then follow the link mentioned on the page to obtain your `google client ID`.
As for `resetting secret`, there are many ways to generate these secret, choose any one you prefer, or for testing purpose, you can just make up your own secrets, but either way, please make sure you have the same `resetting secret` setup for both front end and back end.
Lastly, `back end site url` can be left blank until both back end and front end are deployed and set up domain names. **Note**: make sure domain names for both front end and back end are under the same parent domain name, because we need to make sure our cookie can be fetched correctly for both sides.






