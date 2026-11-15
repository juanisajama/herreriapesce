import ganchos from "@/assets/ganchos.jpg";
import chulengo from "@/assets/chulengo.jpg";
import bici from "@/assets/soporte-bici.jpg";
import box from "@/assets/soporte-box.jpg";
import barra from "@/assets/barra.jpg";

export type Product = {
  id: string;
  name: string;
  image: string;
  short: string;
  dimensions: string;
  capacity: string;
  material: string;
  price: number;
  discountPercent: number;
  depositPercent: number;
  soldOut?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "ganchos-x3",
    name: "Perchero Pared Industrial Moderno Organizador X 3 Ganchos",
    image: ganchos,
    short: "Perchero de pared con 3 ganchos de hierro, ideal para entrada, cocina o taller.",
    dimensions: "12 × 5 cm c/u",
    capacity: "Hasta 15 kg c/u",
    material: "Hierro macizo 10 mm, pintura epoxi negra",
    price: 20000,
    discountPercent: 50,
    depositPercent: 10,
  },
  {
    id: "parrilla-chulengo",
    name: "Parrilla tambor chulengo",
    image: chulengo,
    short: "Chulengo de tambor con tapa, parrilla y patas reforzadas.",
    dimensions: "120 × 60 × 120 cm",
    capacity: "Para 15 a 20 personas",
    material: "Tambor 200 L, hierro ángulo y varilla 8 mm",
    price: 180000,
    discountPercent: 50,
    depositPercent: 20,
  },
  {
    id: "soporte-bici",
    name: "Soporte bici pared",
    image: bici,
    short: "Colgá tu bici en la pared y ganá espacio.",
    dimensions: "45 × 12 cm",
    capacity: "Hasta 25 kg",
    material: "Caño estructural 20×20, placa 4 mm",
    price: 35000,
    discountPercent: 50,
    depositPercent: 10,
  },
  {
    id: "soporte-bolsa-box",
    name: "Soporte bolsa box pared",
    image: box,
    short: "Brazo reforzado para bolsa de boxeo, con cadena incluida.",
    dimensions: "Brazo 70 cm, placa 50 cm",
    capacity: "Hasta 80 kg",
    material: "Caño estructural 40×40, placa 6 mm",
    price: 50000,
    discountPercent: 50,
    depositPercent: 10,
  },
  {
    id: "barra-ejercicio",
    name: "Barra ejercicio rack pared",
    image: barra,
    short: "Barra de dominadas para pared con agarres múltiples.",
    dimensions: "120 × 60 cm",
    capacity: "Hasta 150 kg",
    material: "Caño 1\" pared gruesa, placas 6 mm",
    price: 120000,
    discountPercent: 50,
    depositPercent: 10,
    soldOut: true,
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const getOriginalPrice = (product: Product) =>
  Math.round(product.price / (1 - product.discountPercent / 100));
