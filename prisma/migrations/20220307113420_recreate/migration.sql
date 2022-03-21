/*
  Warnings:

  - You are about to drop the column `biometricData` on the `User` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[embeddings]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- DropIndex
DROP INDEX "User.biometricData_unique";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "biometricData",
ADD COLUMN     "embeddings" BIGINT[];

-- CreateIndex
CREATE UNIQUE INDEX "User.embeddings_unique" ON "User"("embeddings");
