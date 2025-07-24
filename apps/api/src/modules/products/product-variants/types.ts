export type GetProductVariantParams = {
    product_id: string
}

export type CreateVariantParams = {
    product_id: string;
    name: string;
    aroma: string;
    price?: any;
}

export type UpdateVariantParams = {
    variant_id: string;
    name: string;
}

export type DeleteVariantParams = {
    variant_id: string;
    product_id: string; 
};