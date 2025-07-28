import { Address } from "../addresses";

export const ADDRESS_TYPES = [
  { value: "Ev", label: "Ev" },
  { value: "Ofis", label: "Ofis" },
  { value: "İş", label: "İş Yeri" },
  { value: "Diğer", label: "Diğer" },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "1",
    type: "Ev",
    title: "Ana Ev Adresi",
    description: "Birincil ev adresi",
    fullAddress:
      "Ahmet Mah. Mehmetoğlu Sk., No: 1 Daire: 2, Ataşehir, İstanbul, Türkiye",
  },
  {
    id: "2",
    type: "Ofis",
    title: "İş Yeri Adresi",
    description: "Ana ofis binası",
    fullAddress:
      "Ayşe Mah. Fatmaoğlu Cad., No: 4 D: 4, Ataşehir, İstanbul, Türkiye",
  },
];
