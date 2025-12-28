/*
  Warnings:

  - You are about to drop the column `inrWalletId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `solWalletId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InrWallet" DROP CONSTRAINT "InrWallet_userId_fkey";

-- DropForeignKey
ALTER TABLE "SolWallet" DROP CONSTRAINT "SolWallet_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "inrWalletId",
DROP COLUMN "solWalletId",
ALTER COLUMN "provider" SET DEFAULT 'credentials',
ALTER COLUMN "sub" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "InrWallet" ADD CONSTRAINT "InrWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolWallet" ADD CONSTRAINT "SolWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
