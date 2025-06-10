/*
  Warnings:

  - You are about to alter the column `image` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image_id" INTEGER,
ALTER COLUMN "image" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "file_library_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
