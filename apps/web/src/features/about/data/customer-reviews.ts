import { Certificate, CustomerReview } from "../types";

export const customerReviews: CustomerReview[] = [
  {
    id: "1",
    userName: "Mustafa Ü.",
    rating: 5,
    title: "L carnitine",
    description: "Gayet şeffaf ve güzel kargoyla geldi çok memnun kaldım",
    date: "06/05/24",
    productName: "L-CARNITINE",
    verified: true
  },
  {
    id: "2",
    userName: "Ahmet K.",
    rating: 5,
    title: "Mükemmel kalite",
    description: "Ürünlerin kalitesi gerçekten çok iyi. Düzenli kullanıyorum ve sonuçlarından çok memnunum.",
    date: "05/05/24",
    productName: "Whey Protein",
    verified: true
  },
  {
    id: "3",
    userName: "Zeynep A.",
    rating: 5,
    title: "Hızlı kargo",
    description: "Sipariş verdiğim gün kargo çıktı, ertesi gün elimdeydi. Ürün kalitesi de harika.",
    date: "04/05/24",
    productName: "BCAA+",
    verified: true
  },
  {
    id: "4",
    userName: "Mehmet S.",
    rating: 4,
    title: "Güvenilir firma",
    description: "Uzun süredir alışveriş yapıyorum. Kaliteli ürünler ve güvenilir hizmet.",
    date: "03/05/24",
    verified: true
  },
  {
    id: "5",
    userName: "Fatma T.",
    rating: 5,
    title: "Çok beğendim",
    description: "Ürün tam beklediğim gibiydi. Lezzeti ve kalitesi mükemmel.",
    date: "02/05/24",
    productName: "Collagen",
    verified: true
  }
];

export const certificates: Certificate[] = [
  {
    id: "1",
    name: "ISO 9001",
    imageUrl: "/certificates/iso-9001.png",
    description: "Kalite Yönetim Sistemi"
  },
  {
    id: "2", 
    name: "HELAL",
    imageUrl: "/certificates/helal.png",
    description: "Helal Sertifikası"
  },
  {
    id: "3",
    name: "ISO 22000",
    imageUrl: "/certificates/iso-22000.png", 
    description: "Gıda Güvenliği Yönetim Sistemi"
  },
  {
    id: "4",
    name: "GMP",
    imageUrl: "/certificates/gmp.png",
    description: "İyi Üretim Uygulamaları"
  },
  {
    id: "5",
    name: "ISO 45001",
    imageUrl: "/certificates/iso-45001.png",
    description: "İş Sağlığı ve Güvenliği"
  },
  {
    id: "6",
    name: "Sertifika",
    imageUrl: "/certificates/certificate.png",
    description: "Kalite Belgesi"
  }
];

export const reviewStats = {
  averageRating: 4.8,
  totalReviews: 195900,
  reviewButtonText: "ÜRÜN İNCELEMELERİ"
}; 