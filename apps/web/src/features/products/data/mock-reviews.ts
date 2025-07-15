export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  description: string;
  date: string;
  verified?: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const mockReviews: Review[] = [
  {
    id: "1",
    userId: "user1",
    userName: "EREN U.",
    rating: 5,
    title: "Her zamanki kalite. Teşekkürler",
    description: "Her zamanki kalite. Teşekkürler",
    date: "06/05/24",
    verified: true
  },
  {
    id: "2",
    userId: "user2",
    userName: "Bahadır K.",
    rating: 5,
    title: "En iyi aroma",
    description: "En iyi aroma",
    date: "06/05/24",
    verified: true
  },
  {
    id: "3",
    userId: "user3",
    userName: "Burhan K.",
    rating: 5,
    title: "Yıllardır en beğendiğim protein tozu",
    description: "Yıllardır en beğendiğim protein tozu protein gr ne kadar düşük olsada",
    date: "05/05/24",
    verified: true
  },
  {
    id: "4",
    userId: "user4",
    userName: "Mehmet Y.",
    rating: 4,
    title: "Gayet başarılı ürün",
    description: "Kaliteli ve lezzetli. Tek eksiği biraz pahalı olması.",
    date: "04/05/24",
    verified: true
  },
  {
    id: "5",
    userId: "user5",
    userName: "Ayşe K.",
    rating: 5,
    title: "Mükemmel kıvam",
    description: "Çok kolay karışıyor ve tadı harika. Kesinlikle tavsiye ederim.",
    date: "03/05/24"
  },
  {
    id: "6",
    userId: "user6",
    userName: "Can D.",
    rating: 4,
    title: "İyi ama geliştirilmeli",
    description: "Genel olarak memnunum ancak ambalaj biraz daha sağlam olabilir.",
    date: "02/05/24"
  },
  {
    id: "7",
    userId: "user7",
    userName: "Fatma S.",
    rating: 5,
    title: "Harika protein",
    description: "Antrenmanlarımda çok işime yarıyor. Sindirimi de çok kolay.",
    date: "01/05/24",
    verified: true
  },
  {
    id: "8",
    userId: "user8",
    userName: "Ali R.",
    rating: 3,
    title: "Ortalama",
    description: "Kötü değil ama beklentimi karşılamadı. Daha iyilerini denedim.",
    date: "30/04/24"
  }
];

export const calculateReviewStats = (reviews: Review[]): ReviewStats => {
  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalReviews > 0 ? Number((totalRating / totalReviews).toFixed(1)) : 0;

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  return {
    averageRating,
    totalReviews,
    ratingDistribution
  };
}; 