/*
  Warnings:

  - Added the required column `city` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadRegistration" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Brasil',
ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '+55',
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;
