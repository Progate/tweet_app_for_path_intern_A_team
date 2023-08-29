import express from "express";
import {PrismaClient} from "@prisma/client";
import {getUser} from "@/models/user";
import {databaseManager} from "@/db/index";

export const followRouter = express.Router();
const regex = /^[1-9][0-9]*$/;

followRouter.post("/:userId", async (req, res) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  const userNumber = Number(userId);

  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return res.json({
      success: "false",
      msg: "Invalid error: currentUserId is undefined.",
    });
  }

  if (userId === String(currentUserId)) {
    return res.json({
      success: "false",
      msg: "Invalid error: You can't follow yourself.",
    });
  }
  // userIdがnumberじゃない場合
  // 存在しないuserIdの場合
  if (!regex.test(userId)) {
    return res.json({
      success: "false",
      msg: "Invalid error: userId is not number.",
    });
  }

  const user = await getUser(userNumber);

  if (user === null) {
    return res.json({
      success: "false",
      msg: "Invalid error: target user does not exist.",
    });
  }
  // 既にフォローしている場合
  const prisma = databaseManager.getInstance();
  const follow = await prisma.follow.findFirst({
    where: {
      followingId: currentUserId,
      followedId: userNumber,
    },
  });

  if (follow !== null) {
    return res.json({
      success: "false",
      msg: "Invalid error: You have already followed target user.",
    });
  }

  await prisma.follow.create({
    data: {
      followingId: currentUserId,
      followedId: Number(userId),
    },
  });

  res.json({success: "true", msg: ""});
});

followRouter.delete("/:userId", async (req, res) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  const userNumber = Number(userId);

  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return res.json({
      success: "false",
      msg: "Invalid error: currentUserId is undefined.",
    });
  }

  if (userId === String(currentUserId)) {
    return res.json({
      success: "false",
      msg: "Invalid error: You can't unfollow yourself.",
    });
  }
  // userIdがnumberじゃない場合
  // 存在しないuserIdの場合
  if (!regex.test(userId)) {
    return res.json({
      success: "false",
      msg: "Invalid error: userId is not number.",
    });
  }

  const user = await getUser(userNumber);

  if (user === null) {
    return res.json({
      success: "false",
      msg: "Invalid error: target user does not exist.",
    });
  }
  // フォローしていない場合
  const prisma = databaseManager.getInstance();
  const follow = await prisma.follow.findFirst({
    where: {
      followingId: currentUserId,
      followedId: userNumber,
    },
  });

  if (follow === null) {
    return res.json({
      success: "false",
      msg: "Invalid error: You haven't followed target user yet.",
    });
  }

  await prisma.follow.delete({
    where: {
      /* eslint-disable camelcase */
      followingId_followedId: {
        followingId: currentUserId,
        followedId: Number(userId),
      },
      /* eslint-enable camelcase */
    },
  });

  res.json({success: "true", msg: ""});
});
