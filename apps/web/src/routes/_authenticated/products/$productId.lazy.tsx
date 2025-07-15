import ProductDetail from "#features/products/product-detail";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/products/$productId")({
  component: ProductDetail,
});