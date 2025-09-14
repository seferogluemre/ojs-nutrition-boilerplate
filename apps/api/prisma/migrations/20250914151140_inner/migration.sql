-- AlterTable
ALTER TABLE "product_comments" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
