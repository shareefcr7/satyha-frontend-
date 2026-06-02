export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number | string;
  _id?: string;
  title?: string;
  name?: string;
  category?: string;
  subcategory?: string;
  shortDescription?: string;
  description?: string;
  srcUrl?: string;
  mainImage?: string;
  gallery?: string[];
  price?: number;
  mrpPrice?: number;
  offerAmount?: number;
  sellingPrice?: number;
  stock?: number;
  totalStock?: number;
  discount?: Discount;
  rating?: number;
};
