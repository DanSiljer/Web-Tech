/*
  Warnings:

  - The values [OWNER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `percentageDiscount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `collection` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grife` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `available` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'SELLER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'SELLER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropIndex
DROP INDEX "Product_categoryId_key";

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "categoryId",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "imageUrl",
DROP COLUMN "percentageDiscount",
DROP COLUMN "price",
DROP COLUMN "updateAt",
ADD COLUMN     "collection" CHAR(6) NOT NULL,
ADD COLUMN     "grife" VARCHAR(25) NOT NULL,
ADD COLUMN     "product" CHAR(12) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000),
DROP COLUMN "available",
ADD COLUMN     "available" BIT(1) NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("product");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(200);

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "ProductPrice" (
    "cod_price" CHAR(2) NOT NULL,
    "productProduct" CHAR(12) NOT NULL,
    "price" MONEY NOT NULL,
    "discount_limit" DECIMAL(8,5) NOT NULL,
    "discount_promotion" DECIMAL(8,5) NOT NULL,
    "price_liquid" MONEY NOT NULL,
    "date_for_trnasfer" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("cod_price")
);

-- CreateTable
CREATE TABLE "LogProductsPriceField" (
    "id" INTEGER NOT NULL,
    "field" VARCHAR(50) NOT NULL,

    CONSTRAINT "LogProductsPriceField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogProductsPrice" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cod_price" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "id_alter_field" INTEGER NOT NULL,
    "original_value" DECIMAL(14,2) NOT NULL,
    "new_value" DECIMAL(14,2) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogProductsPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_productProduct_key" ON "ProductPrice"("productProduct");

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productProduct_fkey" FOREIGN KEY ("productProduct") REFERENCES "Product"("product") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogProductsPrice" ADD CONSTRAINT "LogProductsPrice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogProductsPrice" ADD CONSTRAINT "LogProductsPrice_cod_price_fkey" FOREIGN KEY ("cod_price") REFERENCES "ProductPrice"("cod_price") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogProductsPrice" ADD CONSTRAINT "LogProductsPrice_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogProductsPrice" ADD CONSTRAINT "LogProductsPrice_id_alter_field_fkey" FOREIGN KEY ("id_alter_field") REFERENCES "LogProductsPriceField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
