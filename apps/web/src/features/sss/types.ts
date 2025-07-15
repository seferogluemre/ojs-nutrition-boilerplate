export interface SSSItem {
  request: string;
  reply: string;
}

export interface SSSData {
  genel: SSSItem[];
  ürünler: SSSItem[];
  kargo: SSSItem[];
}

export type SSSCategory = keyof SSSData; 