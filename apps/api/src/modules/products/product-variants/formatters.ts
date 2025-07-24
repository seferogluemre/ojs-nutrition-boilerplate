import { ProductVariantService } from "./service";


type VariantPayload = Awaited<ReturnType<typeof ProductVariantService.create>>
type VariantListPayload = Awaited<ReturnType<typeof ProductVariantService.get>>;

export abstract class ProductVariantFormatter {
    static format(variant: VariantPayload) {
        return {
            id: variant?.uuid,
            name: variant?.name,
            aroma: variant?.aroma,
            createdAt: variant?.createdAt,
            updatedAt: variant?.updatedAt,
        };
    }

    static formatList(variants: VariantListPayload) {
        return variants?.map((variant) => ({
            id: variant.uuid,
            name: variant.name,
            aroma: variant.aroma,
            createdAt: variant.createdAt,
            updatedAt: variant.updatedAt
        }))
    }
}