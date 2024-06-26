/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `attachments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attachments_url_key" ON "attachments"("url");
