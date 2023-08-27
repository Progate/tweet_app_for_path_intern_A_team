import express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
export const followRouter = express.Router();

followRouter.post("/", async (req, res) => {
  // const userId = req.params.userId;
  // const followerId = req.session.userId;

  // if (userId === followerId) {
  //   return res.status(400).send("You can't follow yourself.");
  // }

  // await prisma.follow.create({
  //   data: {
  //     followerId: followerId,
  //     followingId: userId,
  //   },
  // });

  res.send("Followed successfully");
});