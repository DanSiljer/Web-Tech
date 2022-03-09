-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" VARCHAR(15) NOT NULL DEFAULT E'';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "admin" SET DEFAULT E'0';
