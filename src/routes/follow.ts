import express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export const followRouter = express.Router();

followRouter.post("/:userId", async (req, res) => {
  const {userId} = req.params;
  const currentUserId = req.authentication?.currentUserId;

  if (currentUserId === undefined) {
    // `ensureAuthUser` enforces `currentUserId` is not undefined.
    // This must not happen.
    return res.status(400).send("Invalid error: currentUserId is undefined.");
  }

  if (userId === String(currentUserId)) {
    return res.status(400).send("You can't follow yourself.");
  }

  await prisma.follow.create({
    data: {
      followingId: currentUserId,
      followedId: Number(userId),
    },
  });

  res.send("Followed successfully");
});