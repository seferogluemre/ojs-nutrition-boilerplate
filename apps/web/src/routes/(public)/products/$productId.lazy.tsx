import ProductDetail from "#features/products/product-detail";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(public)/products/$productId")({
  component: ProductDetail,
});