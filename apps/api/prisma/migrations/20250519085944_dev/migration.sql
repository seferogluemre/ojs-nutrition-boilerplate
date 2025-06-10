-- CreateEnum
CREATE TYPE "file_library_asset_type" AS ENUM ('PRODUCT_IMAGE', 'USER_IMAGE', 'SCHOOL_LOGO', 'PRODUCT_BRAND_LOGO', 'SCHOOL_BRAND_LOGO');

-- CreateEnum
CREATE TYPE "file_library_asset_file_type" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "file_asset_mime_type" AS ENUM ('IMAGE_JPEG', 'IMAGE_PNG', 'IMAGE_GIF', 'IMAGE_WEBP', 'IMAGE_SVG', 'IMAGE_BMP', 'IMAGE_TIFF', 'VIDEO_MP4', 'VIDEO_AVI', 'VIDEO_MPEG', 'VIDEO_WEBM', 'VIDEO_OGG');

-- CreateTable
CREATE TABLE "file_library_assets" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" VARCHAR(512) NOT NULL,
    "type" "file_library_asset_type" NOT NULL,
    "file_type" "file_library_asset_file_type" NOT NULL,
    "mime_type" "file_asset_mime_type" NOT NULL,
    "size" BIGINT NOT NULL,
    "path" VARCHAR(512) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "file_library_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "file_library_assets_uuid_key" ON "file_library_assets"("uuid");
