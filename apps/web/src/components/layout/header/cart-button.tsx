import { Button } from "#components/ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";

interface CartButtonProps {
  cartItemCount: number;
  onClick: () => void;
  variant?: "desktop" | "tablet" | "mobile";
}

export const CartButton: React.FC<CartButtonProps> = ({
  cartItemCount,
  onClick,
  variant = "desktop"
}) => {
  const getStyles = () => {
    switch (variant) {
      case "desktop":
        return {
          button: "relative flex h-10 items-center space-x-2 bg-gray-600 px-4 py-2 text-white hover:bg-gray-700",
          icon: "h-5 w-5",
          text: "font-medium",
          badge: "absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
        };
      case "tablet":
        return {
          button: "relative flex h-9 items-center space-x-1 bg-gray-600 px-3 py-2 text-white hover:bg-gray-700",
          icon: "h-4 w-4",
          text: "text-sm font-medium",
          badge: "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
        };
      case "mobile":
        return {
          button: "relative text-gray-700 dark:text-gray-900 hover:bg-gray-100",
          icon: "h-7 w-7 stroke-2",
          text: "",
          badge: "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-black text-white"
        };
      default:
        return {
          button: "relative flex h-10 items-center space-x-2 bg-gray-600 px-4 py-2 text-white hover:bg-gray-700",
          icon: "h-5 w-5",
          text: "font-medium",
          badge: "absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
        };
    }
  };

  const styles = getStyles();

  return (
    <Button
      size="sm"
      variant={variant === "mobile" ? "ghost" : "default"}
      className={styles.button}
      onClick={onClick}
    >
      <ShoppingCart className={styles.icon} />
      {variant !== "mobile" && (
        <span className={styles.text}>SEPET</span>
      )}
      <span className={styles.badge}>
        {cartItemCount}
      </span>
    </Button>
  );
};