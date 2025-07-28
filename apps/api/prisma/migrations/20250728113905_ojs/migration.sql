/*
  Warnings:

  - You are about to drop the column `customerId` on the `product_comments` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_comments` table. All the data in the column will be lost.
  - You are about to drop the `customer_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_id` to the `product_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `product_comments` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `product_comments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "customer_addresses" DROP CONSTRAINT "customer_addresses_city_id_fkey";

-- DropForeignKey
ALTER TABLE "customer_addresses" DROP CONSTRAINT "customer_addresses_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "product_comments" DROP CONSTRAINT "product_comments_customerId_fkey";

-- DropForeignKey
ALTER TABLE "product_comments" DROP CONSTRAINT "product_comments_productId_fkey";

-- AlterTable
ALTER TABLE "product_comments" DROP COLUMN "customerId",
DROP COLUMN "productId",
ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "content" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "product_variants" ALTER COLUMN "price" DROP NOT NULL;

-- DropTable
DROP TABLE "customer_addresses";

-- DropTable
DROP TABLE "customers";

-- AddForeignKey
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_comments" ADD CONSTRAINT "product_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
