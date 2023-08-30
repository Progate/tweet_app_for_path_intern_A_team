import {Follow} from "@prisma/client";
import {databaseManager} from "@/db/index";

export const hasFollow = async (
  userId: number,
  targetUserId: number
): Promise<boolean> => {
  const prisma = databaseManager.getInstance();
  const checkFollowed = await prisma.follow.findUnique({
    /* eslint-disable camelcase */
    where: {
      followingId_followedId: {
        followingId: userId,
        followedId: targetUserId,
      },
    },
    /* eslint-enable camelcase */
  });
  if (checkFollowed === null) {
    return false;
  } else {
    return true;
  }
};
// export const getUserIdsByFollowInfo = (follows: {followedId: number}[] | {followingId: number}[]): number[] => {
//     return follows.map(follow => follow.followedId || follow.followingId)
// }

export const getFollowingCount = async (
  followingId: number
): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.follow.count({
    where: {
      followingId,
    },
  });
  return count;
};

export const getFollowedCount = async (followedId: number): Promise<number> => {
  const prisma = databaseManager.getInstance();
  const count = await prisma.follow.count({
    where: {
      followedId,
    },
  });
  return count;
};
