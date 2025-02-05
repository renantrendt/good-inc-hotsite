-- CreateTable
CREATE TABLE "LeadRegistration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cpf" TEXT,
    "clothesOdor" TEXT NOT NULL,
    "productUnderstanding" TEXT NOT NULL,
    "mainFocus" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "LeadRegistration_pkey" PRIMARY KEY ("id")
);
