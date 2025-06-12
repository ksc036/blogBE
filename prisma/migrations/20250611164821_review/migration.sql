-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'DONE', 'READY', 'MISSED');

-- CreateTable
CREATE TABLE "ReviewPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reviewDays" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewInstance" (
    "id" SERIAL NOT NULL,
    "reviewPlanId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewInstance_userId_scheduledDate_idx" ON "ReviewInstance"("userId", "scheduledDate");

-- AddForeignKey
ALTER TABLE "ReviewPlan" ADD CONSTRAINT "ReviewPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewInstance" ADD CONSTRAINT "ReviewInstance_reviewPlanId_fkey" FOREIGN KEY ("reviewPlanId") REFERENCES "ReviewPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewInstance" ADD CONSTRAINT "ReviewInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewInstance" ADD CONSTRAINT "ReviewInstance_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
