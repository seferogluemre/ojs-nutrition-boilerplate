-- AlterTable
ALTER TABLE "products" ADD COLUMN     "explanation" JSONB;

-- AlterTable
ALTER TABLE "user_addresses" ADD COLUMN     "deleted_at" TIMESTAMP(3);
