export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  discountPercentage?: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "WHEY PROTEIN",
    shortDescription: "EN ÇOK TERCİH EDİLEN PROTEİN TAKVİYESİ",
    price: 549,
    rating: 4.8,
    reviewCount: 10869,
    image: "/images/collagen.jpg",
  },
  {
    id: "2", 
    name: "WHEY ISOLATE",
    shortDescription: "SADE PROTEİN, LEZZET YOK",
    price: 749,
    rating: 4.9,
    reviewCount: 687,
    image: "/images/collagen.jpg",
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
  },
  {
    id: "4",
    name: "PEA PROTEIN",
    shortDescription: "BİTKİSEL KAYNAKLARI PROTEİN",
    price: 349,
    rating: 4.6,
    reviewCount: 1778,
    image: "/images/collagen.jpg",
  },
  {
    id: "5",
    name: "MICELLAR CASEIN",
    shortDescription: "YAVAŞ SINDIRIM PROTEİN KAYNAĞI",
    price: 599,
    rating: 4.5,
    reviewCount: 166,
    image: "/images/collagen.jpg",
  },
  {
    id: "6",
    name: "EGG WHITE POWDER",
    shortDescription: "PROTEİN ALTKIPLI KUVVET",
    price: 899,
    rating: 4.8,
    reviewCount: 339,
    image: "/images/collagen.jpg",
  },
  {
    id: "7",
    name: "MILK PROTEIN",
    shortDescription: "SADE LAKTO SÜTÜ WHEY PROTEİN",
    price: 699,
    rating: 4.4,
    reviewCount: 205,
    image: "/images/collagen.jpg",
  },
  {
    id: "8",
    name: "SOYA PROTEIN",
    shortDescription: "VEGETARİAN PROTEİN KAYNAĞI",
    price: 449,
    rating: 4.3,
    reviewCount: 314,
    image: "/images/collagen.jpg",
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
  },
  {
    id: "12",
    name: "BCAA+",
    shortDescription: "SADE LAKTO SÜTÜ WHEY PROTEİN",
    price: 699,
    rating: 4.6,
    reviewCount: 339,
    image: "/images/collagen.jpg",
  },
]; 