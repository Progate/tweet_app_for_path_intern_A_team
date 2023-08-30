import express from "express";
import {ensureAuthUser} from "@/middlewares/authentication";
import {databaseManager} from "@/db";
export const followingPostRouter = express.Router();

type TweetType = "tweet" | "retweet" | "like";
type Post = {
  id: number;
  content: string;
  user: User;
};
type User = {
  id: number;
  name: string;
  imageName: string;
};

type Timeline = {
  type: TweetType;
  post: Post;
  user: User;
  activedAt: Date;
};

followingPostRouter.get("/", ensureAuthUser, async (req, res, next) => {
  const prisma = databaseManager.getInstance();
  const currentUserId = req.authentication?.currentUserId;
  // userのfollowings一覧を取得
  const followingUsers = await prisma.follow.findMany({
    where: {
      followingId: currentUserId,
    },
    select: {
      followedId: true,
    },
  });
  const followingUserIds = followingUsers.map(function (value) {
    return value.followedId;
  });
  // followings一覧に紐づくposts一覧を取得
  const followingPosts = await prisma.post.findMany({
    where: {
      userId: {
        in: followingUserIds,
      },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          imageName: true,
        },
      },
    },
  });
  const followingRetweetPosts = await prisma.retweet.findMany({
    where: {
      userId: {
        in: followingUserIds,
      },
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          imageName: true,
        },
      },
      retweetedAt: true,
      post: {
        select: {
          id: true,
          content: true,
          user: {
            select: {
              id: true,
              name: true,
              imageName: true,
            },
          },
        },
      },
    },
  });
  const timeline: Timeline[] = followingPosts
    .map((followingPost): Timeline => {
      return {
        type: "tweet",
        post: {
          id: followingPost.id,
          content: followingPost.content,
          user: {
            id: followingPost.user.id,
            name: followingPost.user.name,
            imageName: followingPost.user.imageName,
          },
        },
        user: {
          id: followingPost.user.id,
          name: followingPost.user.name,
          imageName: followingPost.user.imageName,
        },
        activedAt: followingPost.createdAt,
      };
    })
    .concat(
      followingRetweetPosts.map((followingRetweet): Timeline => {
        return {
          type: "retweet",
          post: {
            id: followingRetweet.post.id,
            content: followingRetweet.post.content,
            user: {
              id: followingRetweet.post.user.id,
              name: followingRetweet.post.user.name,
              imageName: followingRetweet.post.user.imageName,
            },
          },
          user: {
            id: followingRetweet.user.id,
            name: followingRetweet.user.name,
            imageName: followingRetweet.user.imageName,
          },
          activedAt: followingRetweet.retweetedAt,
        };
      })
    );

  timeline.sort((a, b) => {
    return b.activedAt.getTime() - a.activedAt.getTime();
  });

  res.render("following_posts/index", {
    timeline,
  });
});
