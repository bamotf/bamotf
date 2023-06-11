/*
  Warnings:

  - You are about to alter the column `amount` on the `PaymentIntent` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(20,8)`.
  - The `status` column on the `PaymentIntent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(20,8)`.

*/
-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('pending', 'processing', 'succeeded', 'canceled');

-- AlterTable
ALTER TABLE "PaymentIntent" ADD COLUMN     "currency" VARCHAR(3) NOT NULL DEFAULT 'BTC',
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "tolerance" DECIMAL(5,4) NOT NULL DEFAULT 0.02,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "confirmations" SET DEFAULT 1,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentIntentStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "originalAmount" DECIMAL(20,2),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,8);

-- CreateTable
CREATE TABLE "WebhookAttempt" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "paymentIntentId" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "body" JSONB NOT NULL,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookAttempt" ADD CONSTRAINT "WebhookAttempt_paymentIntentId_fkey" FOREIGN KEY ("paymentIntentId") REFERENCES "PaymentIntent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
