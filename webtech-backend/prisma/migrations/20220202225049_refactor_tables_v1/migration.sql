/*
  Warnings:

  - You are about to drop the column `cod_price` on the `LogProductsPrice` table. All the data in the column will be lost.
  - You are about to drop the column `id_alter_field` on the `LogProductsPrice` table. All the data in the column will be lost.
  - The primary key for the `ProductPrice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cod_price` on the `ProductPrice` table. All the data in the column will be lost.
  - You are about to drop the column `date_for_trnasfer` on the `ProductPrice` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ProductPrice` table. All the data in the column will be lost.
  - You are about to drop the column `productProduct` on the `ProductPrice` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product]` on the table `ProductPrice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alter_field_id` to the `LogProductsPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_price_id` to the `LogProductsPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `LogProductsPriceField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cod_tab_price_id` to the `ProductPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_1` to the `ProductPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `ProductPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ProductPrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LogProductsPrice" DROP CONSTRAINT "LogProductsPrice_cod_price_fkey";

-- DropForeignKey
ALTER TABLE "LogProductsPrice" DROP CONSTRAINT "LogProductsPrice_id_alter_field_fkey";

-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_productProduct_fkey";

-- DropIndex
DROP INDEX "ProductPrice_productProduct_key";

-- AlterTable
ALTER TABLE "LogProductsPrice" DROP COLUMN "cod_price",
DROP COLUMN "id_alter_field",
ADD COLUMN     "alter_field_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "product_price_id" INTEGER NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
CREATE SEQUENCE "logproductspricefield_id_seq";
ALTER TABLE "LogProductsPriceField" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('logproductspricefield_id_seq');
ALTER SEQUENCE "logproductspricefield_id_seq" OWNED BY "LogProductsPriceField"."id";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_pkey",
DROP COLUMN "cod_price",
DROP COLUMN "date_for_trnasfer",
DROP COLUMN "price",
DROP COLUMN "productProduct",
ADD COLUMN     "cod_tab_price_id" CHAR(2) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "price_1" MONEY NOT NULL,
ADD COLUMN     "product" CHAR(12) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "role",
DROP COLUMN "updateAt",
ADD COLUMN     "admin" BIT(1) NOT NULL DEFAULT E'0',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "TabPrice" (
    "id" CHAR(2) NOT NULL,
    "tabPrice" CHAR(12) NOT NULL,

    CONSTRAINT "TabPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_product_key" ON "ProductPrice"("product");

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_cod_tab_price_id_fkey" FOREIGN KEY ("cod_tab_price_id") REFERENCES "TabPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("product") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogProductsPrice" ADD CONSTRAINT "LogProductsPrice_product_price_id_fkey" FOREIGN KEY ("product_price_id") REFERENCES "ProductPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogProductsPrice" ADD CONSTRAINT "LogProductsPrice_alter_field_id_fkey" FOREIGN KEY ("alter_field_id") REFERENCES "LogProductsPriceField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
