import { auth } from "#modules/auth/authentication/plugin";
import Elysia from "elysia";
import { createVariantDto, deleteVariantDto, getProductVariantsDto, updateVariantDto } from "./dtos";
import { ProductVariantFormatter } from "./formatters";
import { ProductVariantService } from "./service";


export const app = new Elysia({
    prefix: "/variants",
    tags: ['Product Variants'],
})
    .get(
        "/products/:id/variants",
        async ({ params }) => {
            const variants = await ProductVariantService.get({ product_id: params.id })
            return ProductVariantFormatter.format(variants)
        },
        {
            ...getProductVariantsDto
        }
    )
    .use(auth()) 
    .post(
        '/products/:id/variants',
        async ({ params, body, set }) => {
            const variant = await ProductVariantService.create({
                product_id: params.id,
                name: body.name,
            });
            set.status = 201;
            return ProductVariantFormatter.format(variant);
        },
        {
            ...createVariantDto,
        },
    )
    .put(
        '/:id',
        async ({ params, body }) => {
            const variant = await ProductVariantService.update({
                variant_id: params.id,
                name: body.name,
            });
            return ProductVariantFormatter.format(variant);
        },
        {
            ...updateVariantDto,
        },
    )
    .delete(
        '/:id',
        async ({ params, query }) => {
            const result = await ProductVariantService.delete({
                variant_id: params.id,
                product_id: query.product_id,
            });
            return result;
        },
        {
            ...deleteVariantDto,
        },
    );