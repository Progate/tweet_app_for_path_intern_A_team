import express from "express";
import {PrismaClient} from "@prisma/client";
import {getUser} from "@/models/user";
import {databaseManager} from "@/db/index";

const prisma = new PrismaClient();
export const followRouter = express.Router();

followRouter.post("/:userId", async (req, res) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;
  const userNumber = Number(userId);

  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return res.status(400).send("Invalid error: currentUserId is undefined.");
  }

  if (userId === String(currentUserId)) {
    return res.status(400).send("Invalid error: You can't follow yourself.");
  }
  // userIdがnumberじゃない場合
  // 存在しないuserIdの場合
  if (isNaN(userNumber)) {
    return res.status(400).send("Invalid error: userId is not number.")
  }

  const user = await getUser(userNumber)
  console.log(user)

  if (user === null) {
    return res.status(400).send("Invalid error: target user does not exist.")
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
    return res.status(400).send("Invalid error: You have already followed target user.")
  }

  await prisma.follow.create({
    data: {
      followingId: currentUserId,
      followedId: Number(userId),
    },
  });

  res.send("Followed successfully");
});