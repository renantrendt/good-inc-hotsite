-- AlterTable
-- Primeiro adicionamos as colunas como nullable
ALTER TABLE "LeadRegistration" 
ADD COLUMN "city" TEXT,
ADD COLUMN "complement" TEXT,
ADD COLUMN "neighborhood" TEXT,
ADD COLUMN "number" TEXT,
ADD COLUMN "state" TEXT,
ADD COLUMN "street" TEXT,
ADD COLUMN "zipCode" TEXT;

-- Atualizamos os registros existentes com valores padrão
UPDATE "LeadRegistration"
SET 
    "city" = 'Pending Update',
    "number" = 'Pending Update',
    "state" = 'Pending Update',
    "street" = 'Pending Update',
    "zipCode" = 'Pending Update';

-- Agora alteramos as colunas para NOT NULL
ALTER TABLE "LeadRegistration" 
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "number" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "zipCode" SET NOT NULL;
