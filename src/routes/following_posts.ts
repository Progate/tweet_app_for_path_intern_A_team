import express from "express";
import {body, validationResult} from "express-validator";
import {formatDate} from "@/lib/convert_date";
import {getPost, createPost, updatePost, deletePost} from "@/models/post";
import {getPostRetweetedCount, hasUserRetweetedPost} from "@/models/retweet";
import {getAllPostTimeline} from "@/models/user_timeline";
import {getPostLikedCount, hasUserLikedPost} from "@/models/like";
import {ensureAuthUser} from "@/middlewares/authentication";
import {ensureOwnerOfPost} from "@/middlewares/current_user";
import {databaseManager} from "@/db";
import {Touchscreen} from "puppeteer";
export const followingPostRouter = express.Router();

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
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId: {
        in: followingUserIds,
      },
    },
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
  });
  res.render("following_posts/index", {
    followingPosts,
  });
});
