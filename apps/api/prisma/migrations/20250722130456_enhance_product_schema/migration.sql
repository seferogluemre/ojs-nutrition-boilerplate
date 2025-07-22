/*
  Warnings:

  - Added the required column `price` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "parent_id" INTEGER;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "aroma" TEXT,
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "photo_src" TEXT,
ADD COLUMN     "price" JSONB NOT NULL,
ADD COLUMN     "size" JSONB;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "main_category_id" TEXT,
ADD COLUMN     "sub_category_id" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
