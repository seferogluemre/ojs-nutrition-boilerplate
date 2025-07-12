export interface ProductFlavor {
  id: string;
  name: string;
  color: string; // Hex color for the flavor badge
  available: boolean;
}

export interface ProductSize {
  id: string;
  weight: string; // "400g", "1.6KG" 
  servings: number; // 16, 64
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  isRecommended?: boolean;
}

export interface ProductBadge {
  id: string;
  text: string; // "VEJETARYEN", "GLUTENSIZ"
  color: "gray" | "green" | "blue" | "red" | "yellow";
}

export interface ProductBenefit {
  icon: string; // Icon name or path
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images?: string[]; // Additional product images
  discountPercentage?: number;
  
  // New fields for product detail
  flavors: ProductFlavor[];
  sizes: ProductSize[];
  badges: ProductBadge[];
  benefits: ProductBenefit[];
  
  // Stock and availability
  inStock: boolean;
  estimatedDelivery?: string;
  
  // SEO and meta
  slug: string; // URL-friendly version of name
  metaDescription?: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "WHEY PROTEIN",
    shortDescription: "EN ÇOK TERCİH EDİLEN PROTEİN TAKVİYESİ",
    detailedDescription: "Yüksek kaliteli whey protein konsantratı ile üretilmiş, hızlı emilim sağlayan protein takviyesi.",
    price: 549,
    rating: 4.8,
    reviewCount: 10869,
    image: "/images/collagen.jpg",
    images: ["/images/collagen.jpg", "/images/protein.jpg"],
    slug: "whey-protein",
    inStock: true,
    estimatedDelivery: "Aynı Gün Kargo",
    
    flavors: [
      { id: "biskuvi", name: "Bisküvi", color: "#D2B48C", available: true },
      { id: "cikolata", name: "Çikolata", color: "#654321", available: true },
      { id: "muz", name: "Muz", color: "#FFD700", available: true },
      { id: "salted-caramel", name: "Salted Caramel", color: "#CD853F", available: true },
      { id: "choco-nut", name: "Choco Nut", color: "#8B4513", available: true },
      { id: "hindistan-cevizi", name: "Hindistan Cevizi", color: "#F5F5DC", available: true },
      { id: "raspberry-cheesecake", name: "Raspberry Cheesecake", color: "#C71585", available: true },
      { id: "cilek", name: "Çilek", color: "#DC143C", available: true },
      { id: "vanilya", name: "Vanilya", color: "#F5DEB3", available: true },
    ],
    
    sizes: [
      { 
        id: "400g", 
        weight: "400G", 
        servings: 16, 
        price: 549, 
        isRecommended: true 
      },
      { 
        id: "1600g", 
        weight: "1.6KG", 
        servings: 64, 
        price: 1799, 
        oldPrice: 2196, 
        discountPercentage: 18 
      },
      { 
        id: "3200g", 
        weight: "1.6KG X 2 ADET", 
        servings: 128, 
        price: 3299, 
        oldPrice: 4392, 
        discountPercentage: 25 
      },
    ],
    
    badges: [
      { id: "vegetarian", text: "VEJETARYEN", color: "gray" },
      { id: "gluten-free", text: "GLUTENSIZ", color: "gray" },
    ],
    
    benefits: [
      { 
        icon: "truck", 
        title: "Aynı Gün", 
        description: "Ücretsiz Kargo" 
      },
      { 
        icon: "shield", 
        title: "750.000+", 
        description: "Mutlu Müşteri" 
      },
      { 
        icon: "award", 
        title: "Memnuniyet", 
        description: "Garantisi" 
      },
    ],
  },
  
  // Simplified versions for other products
  {
    id: "2", 
    name: "WHEY ISOLATE",
    shortDescription: "SADE PROTEİN, LEZZET YOK",
    price: 749,
    rating: 4.9,
    reviewCount: 687,
    image: "/images/collagen.jpg",
    slug: "whey-isolate",
    inStock: true,
    
    flavors: [
      { id: "sade", name: "Sade", color: "#F5F5F5", available: true },
      { id: "vanilya", name: "Vanilya", color: "#F5DEB3", available: true },
      { id: "cikolata", name: "Çikolata", color: "#654321", available: true },
    ],
    
    sizes: [
      { id: "500g", weight: "500G", servings: 20, price: 749, isRecommended: true },
      { id: "1kg", weight: "1KG", servings: 40, price: 1399, oldPrice: 1598, discountPercentage: 12 },
      { id: "2kg", weight: "2KG", servings: 80, price: 2699, oldPrice: 3196, discountPercentage: 15 },
    ],
    
    badges: [
      { id: "vegetarian", text: "VEJETARYEN", color: "gray" },
      { id: "lactose-free", text: "LAKTOZSUZ", color: "gray" },
    ],
    
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "3",
    name: "FITNESS PAKETİ",
    shortDescription: "EN POPÜLER PAKET FİTNESS İÇİN SAYGI",
    price: 799,
    oldPrice: 1126,
    rating: 4.7,
    reviewCount: 7850,
    image: "/images/collagen.jpg",
    discountPercentage: 29,
    slug: "fitness-paketi",
    inStock: true,
    
    flavors: [
      { id: "karisik", name: "Karışık", color: "#4169E1", available: true },
      { id: "cikolata", name: "Çikolata", color: "#654321", available: true },
      { id: "vanilya", name: "Vanilya", color: "#F5DEB3", available: true },
      { id: "meyve", name: "Meyve", color: "#FF6B6B", available: true },
    ],
    
    sizes: [
      { id: "paket-kucuk", weight: "KÜÇÜK PAKET", servings: 30, price: 799, oldPrice: 1126, discountPercentage: 29, isRecommended: true },
      { id: "paket-orta", weight: "ORTA PAKET", servings: 45, price: 1199, oldPrice: 1598, discountPercentage: 25 },
      { id: "paket-buyuk", weight: "BÜYÜK PAKET", servings: 60, price: 1599, oldPrice: 2196, discountPercentage: 27 },
    ],
    
    badges: [
      { id: "bestseller", text: "EN POPÜLER", color: "red" },
    ],
    
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  // Continue with simplified versions for other products...
  {
    id: "4",
    name: "PEA PROTEIN",
    shortDescription: "BİTKİSEL KAYNAKLARI PROTEİN",
    price: 349,
    rating: 4.6,
    reviewCount: 1778,
    image: "/images/collagen.jpg",
    slug: "pea-protein",
    inStock: true,
    
    flavors: [
      { id: "vanilya", name: "Vanilya", color: "#F5DEB3", available: true },
      { id: "cikolata", name: "Çikolata", color: "#654321", available: true },
      { id: "sade", name: "Sade", color: "#F5F5F5", available: true },
      { id: "karamel", name: "Karamel", color: "#CD853F", available: true },
    ],
    
    sizes: [
      { id: "300g", weight: "300G", servings: 12, price: 349, isRecommended: true },
      { id: "600g", weight: "600G", servings: 24, price: 649, oldPrice: 798, discountPercentage: 18 },
      { id: "1200g", weight: "1.2KG", servings: 48, price: 1199, oldPrice: 1496, discountPercentage: 20 },
    ],
    
    badges: [{ id: "vegan", text: "VEGAN", color: "green" }],
    
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "5",
    name: "MICELLAR CASEIN",
    shortDescription: "YAVAŞ SINDIRIM PROTEİN KAYNAĞI",
    price: 599,
    rating: 4.5,
    reviewCount: 166,
    image: "/images/collagen.jpg",
    slug: "micellar-casein",
    inStock: true,
    
    flavors: [
      { id: "vanilya", name: "Vanilya", color: "#F5DEB3", available: true },
      { id: "cikolata", name: "Çikolata", color: "#654321", available: true },
      { id: "cilek", name: "Çilek", color: "#DC143C", available: true },
    ],
    
    sizes: [
      { id: "450g", weight: "450G", servings: 18, price: 599, isRecommended: true },
      { id: "900g", weight: "900G", servings: 36, price: 1099, oldPrice: 1298, discountPercentage: 15 },
    ],
    
    badges: [{ id: "night-protein", text: "GECE PROTEİNİ", color: "blue" }],
    
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "6",
    name: "EGG WHITE POWDER",
    shortDescription: "PROTEİN ALTKIPLI KUVVET",
    price: 899,
    rating: 4.8,
    reviewCount: 339,
    image: "/images/collagen.jpg",
    slug: "egg-white-powder",
    inStock: true,
    flavors: [{ id: "sade", name: "Sade", color: "#F5F5F5", available: true }],
    sizes: [{ id: "500g", weight: "500G", servings: 20, price: 899 }],
    badges: [{ id: "natural", text: "DOĞAL", color: "green" }],
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  // Add remaining products with basic info...
  {
    id: "7",
    name: "MILK PROTEIN",
    shortDescription: "SADE LAKTO SÜTÜ WHEY PROTEİN",
    price: 699,
    rating: 4.4,
    reviewCount: 205,
    image: "/images/collagen.jpg",
    slug: "milk-protein",
    inStock: true,
    flavors: [{ id: "sutlu", name: "Sütlü", color: "#F5F5DC", available: true }],
    sizes: [{ id: "400g", weight: "400G", servings: 16, price: 699 }],
    badges: [{ id: "calcium", text: "KALSİYUM", color: "blue" }],
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "8",
    name: "SOYA PROTEIN",
    shortDescription: "VEGETARİAN PROTEİN KAYNAĞI",
    price: 449,
    rating: 4.3,
    reviewCount: 314,
    image: "/images/collagen.jpg",
    slug: "soya-protein",
    inStock: true,
    flavors: [{ id: "vanilya", name: "Vanilya", color: "#F5DEB3", available: true }],
    sizes: [{ id: "350g", weight: "350G", servings: 14, price: 449 }],
    badges: [{ id: "vegan", text: "VEGAN", color: "green" }],
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "9",
    name: "AMİNO ASİT PAKETİ",
    shortDescription: "EN POPÜLER AMİNO",
    price: 499,
    oldPrice: 667,
    rating: 4.9,
    reviewCount: 445,
    image: "/images/collagen.jpg",
    discountPercentage: 25,
    slug: "amino-asit-paketi",
    inStock: true,
    flavors: [{ id: "karisik", name: "Karışık", color: "#4169E1", available: true }],
    sizes: [{ id: "paket", weight: "PAKET", servings: 20, price: 499, oldPrice: 667, discountPercentage: 25 }],
    badges: [{ id: "energy", text: "ENERJİ", color: "yellow" }],
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "10",
    name: "VEGAN PROTEİN PAKETİ",
    shortDescription: "EN POPÜLER VEGAN",
    price: 799,
    oldPrice: 1047,
    rating: 4.7,
    reviewCount: 205,
    image: "/images/collagen.jpg",
    discountPercentage: 24,
    slug: "vegan-protein-paketi",
    inStock: true,
    flavors: [{ id: "cikolata", name: "Çikolata", color: "#654321", available: true }],
    sizes: [{ id: "paket", weight: "PAKET", servings: 25, price: 799, oldPrice: 1047, discountPercentage: 24 }],
    badges: [{ id: "vegan", text: "VEGAN", color: "green" }],
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "11",
    name: "DÜŞÜK KALORİLİ SOS PAKETİ",
    shortDescription: "EN LEZZETLI SOSLAR BİR",
    price: 449,
    oldPrice: 681,
    rating: 4.8,
    reviewCount: 121,
    image: "/images/collagen.jpg",
    discountPercentage: 23,
    slug: "dusuk-kalorili-sos-paketi",
    inStock: true,
    flavors: [{ id: "karisik", name: "Karışık", color: "#FF6347", available: true }],
    sizes: [{ id: "paket", weight: "PAKET", servings: 15, price: 449, oldPrice: 681, discountPercentage: 23 }],
    badges: [{ id: "low-cal", text: "DÜŞÜK KALORİ", color: "green" }],
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
  
  {
    id: "12",
    name: "BCAA+",
    shortDescription: "SADE LAKTO SÜTÜ WHEY PROTEİN",
    price: 699,
    rating: 4.6,
    reviewCount: 339,
    image: "/images/collagen.jpg",
    slug: "bcaa-plus",
    inStock: true,
    flavors: [{ id: "elma", name: "Elma", color: "#32CD32", available: true }],
    sizes: [{ id: "300g", weight: "300G", servings: 30, price: 699 }],
    badges: [{ id: "recovery", text: "RECOVERY", color: "blue" }],
    benefits: [
      { icon: "truck", title: "Aynı Gün", description: "Ücretsiz Kargo" },
      { icon: "shield", title: "750.000+", description: "Mutlu Müşteri" },
      { icon: "award", title: "Memnuniyet", description: "Garantisi" },
    ],
  },
]; 