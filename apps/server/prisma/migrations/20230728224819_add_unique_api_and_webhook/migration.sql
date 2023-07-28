/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `Api` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,mode,url]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Webhook_accountId_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Api_key_key" ON "Api"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_accountId_mode_url_key" ON "Webhook"("accountId", "mode", "url");
