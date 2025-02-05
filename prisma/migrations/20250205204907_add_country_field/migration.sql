/*
  Warnings:

  - Added the required column `country` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadRegistration" ADD COLUMN "country" TEXT;

-- Update existing records
UPDATE "LeadRegistration" SET "country" = 'Brazil';

-- Make the column required
ALTER TABLE "LeadRegistration" ALTER COLUMN "country" SET NOT NULL;
