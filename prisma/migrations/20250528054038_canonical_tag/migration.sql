-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "canonicalTagId" INTEGER;

-- CreateTable
CREATE TABLE "CanonicalTag" (
    "id" SERIAL NOT NULL,
    "normalizedName" TEXT NOT NULL,

    CONSTRAINT "CanonicalTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalTag_normalizedName_key" ON "CanonicalTag"("normalizedName");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_canonicalTagId_fkey" FOREIGN KEY ("canonicalTagId") REFERENCES "CanonicalTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
