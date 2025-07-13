-- CreateTable
CREATE TABLE "customer_addresses" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "recipient_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255),
    "city_id" INTEGER NOT NULL,
    "postal_code" VARCHAR(10) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_addresses_uuid_key" ON "customer_addresses"("uuid");

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
