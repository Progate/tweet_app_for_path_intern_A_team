-- CreateTable
CREATE TABLE `follows` (
    `following_id` INTEGER NOT NULL,
    `followed_id` INTEGER NOT NULL,

    PRIMARY KEY (`following_id`, `followed_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_following_id_fkey` FOREIGN KEY (`following_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `follows` ADD CONSTRAINT `follows_followed_id_fkey` FOREIGN KEY (`followed_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
