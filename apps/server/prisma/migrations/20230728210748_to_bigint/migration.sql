/*
  Warnings:

  - You are about to alter the column `amount` on the `PaymentIntent` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,8)` to `BigInt`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,8)` to `BigInt`.
  - You are about to alter the column `originalAmount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "PaymentIntent" ALTER COLUMN "amount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DATA TYPE BIGINT,
ALTER COLUMN "originalAmount" SET DATA TYPE BIGINT;
