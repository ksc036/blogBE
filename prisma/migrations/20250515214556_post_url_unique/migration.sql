/*
  Warnings:

  - A unique constraint covering the columns `[userId,postUrl]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Post_userId_postUrl_key" ON "Post"("userId", "postUrl");
