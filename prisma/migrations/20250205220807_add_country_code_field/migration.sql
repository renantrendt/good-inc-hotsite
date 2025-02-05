/*
  Warnings:

  - Added the required column `countryCode` to the `LeadRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadRegistration" ADD COLUMN     "countryCode" TEXT NOT NULL;
