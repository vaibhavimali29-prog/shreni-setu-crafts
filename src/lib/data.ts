import saree from "@/assets/craft-saree.jpg";
import terracotta from "@/assets/craft-terracotta.jpg";
import bamboo from "@/assets/craft-bamboo.jpg";
import warli from "@/assets/craft-warli.jpg";
import jewelry from "@/assets/craft-jewelry.jpg";
import madhubani from "@/assets/craft-madhubani.jpg";
import brass from "@/assets/craft-brass.jpg";
import kantha from "@/assets/craft-kantha.jpg";

export const craftImages = {
  saree,
  terracotta,
  bamboo,
  warli,
  jewelry,
  madhubani,
  brass,
  kantha,
};

export type ProductStatus = "published" | "draft" | "sold" | "low-stock";

export interface Product {
  id: string;
  artisan_id: string;
  artisanName: string;
  region: string;
  title: string;
  description: string;
  story: string;
  category: string;
  craft_type: string;
  images: string[];
  price: number;
  suggested_price: number;
  tags: string[];
  status: ProductStatus;
  views: number;
  orders: number;
  rating: number;
  created_at: string;
}

export type OrderStatus = "New" | "Confirmed" | "Preparing" | "Shipped" | "Delivered";

export interface Order {
  id: string;
  product_id: string;
  artisan_id: string;
  buyer_id: string;
  buyerName: string;
  buyerCity: string;
  amount: number;
  status: OrderStatus;
  payment_status: "Paid" | "Pending" | "Refunded";
  created_at: string;
}

export interface InquiryMessage {
  from: "buyer" | "artisan";
  text: string;
  time: string;
}

export interface Inquiry {
  id: string;
  artisan_id: string;
  buyer_id: string;
  buyerName: string;
  product_id: string;
  messages: InquiryMessage[];
  unread: boolean;
  status: "open" | "answered";
  created_at: string;
}

export interface Transaction {
  id: string;
  artisan_id: string;
  order_id: string;
  productTitle: string;
  buyerName: string;
  amount: number;
  status: "Settled" | "Processing" | "Pending";
  created_at: string;
}

export interface Artisan {
  id: string;
  name: string;
  language: string;
  craftCategory: string;
  region: string;
  verified: boolean;
  avatar: string;
  joined: string;
}

export const artisan: Artisan = {
  id: "art_001",
  name: "Sunita Deshmukh",
  language: "mr",
  craftCategory: "Handwoven Textiles",
  region: "Yeola, Maharashtra",
  verified: true,
  avatar: "SD",
  joined: "March 2025",
};

export const products: Product[] = [
  {
    id: "p1",
    artisan_id: "art_001",
    artisanName: "Sunita Deshmukh",
    region: "Yeola, Maharashtra",
    title: "Handcrafted Paithani Silk Saree",
    description:
      "A pure silk Paithani saree handwoven on a traditional pit loom over 42 days. The magenta body carries a classic gold zari peacock border, woven thread by thread without any machine work.",
    story:
      "Woven by the Deshmukh family of Yeola, who have kept the Paithani tradition alive for four generations.",
    category: "Handwoven Textiles",
    craft_type: "Traditional Handloom",
    images: [saree],
    price: 8499,
    suggested_price: 8499,
    tags: ["Handmade", "Silk", "Paithani", "Bridal", "Maharashtra"],
    status: "published",
    views: 1284,
    orders: 6,
    rating: 4.9,
    created_at: "2026-07-14",
  },
  {
    id: "p2",
    artisan_id: "art_002",
    artisanName: "Ramesh Kumbhar",
    region: "Bhuj, Gujarat",
    title: "Terracotta Diya Lamp Set of 3",
    description:
      "Hand-thrown terracotta diyas finished with natural clay slip and free-hand line work. Fired in a wood kiln for a deep earthen tone.",
    story: "Made from river clay collected near Bhuj and shaped on a hand-turned wheel.",
    category: "Pottery",
    craft_type: "Wheel-thrown Terracotta",
    images: [terracotta],
    price: 649,
    suggested_price: 699,
    tags: ["Handmade", "Terracotta", "Festive", "Diwali"],
    status: "published",
    views: 2310,
    orders: 41,
    rating: 4.7,
    created_at: "2026-08-02",
  },
  {
    id: "p3",
    artisan_id: "art_003",
    artisanName: "Bipul Boro",
    region: "Majuli, Assam",
    title: "Handwoven Bamboo Storage Basket",
    description:
      "A sturdy cane and bamboo basket woven in the Majuli island style, treated naturally to resist moisture.",
    story: "Bamboo is cut, split and cured by hand before weaving begins.",
    category: "Bamboo Crafts",
    craft_type: "Cane & Bamboo Weaving",
    images: [bamboo],
    price: 899,
    suggested_price: 950,
    tags: ["Handmade", "Bamboo", "Eco-friendly", "Assam"],
    status: "published",
    views: 864,
    orders: 12,
    rating: 4.6,
    created_at: "2026-08-19",
  },
  {
    id: "p4",
    artisan_id: "art_004",
    artisanName: "Jivya Pawar",
    region: "Dahanu, Maharashtra",
    title: "Warli Painted Wooden Serving Tray",
    description:
      "Seasoned sheesham wood tray hand-painted with Warli figures using natural rice paste white on an earthen base.",
    story: "Warli art depicts village life — harvest, dance and the tarpa circle.",
    category: "Wooden Crafts",
    craft_type: "Warli Folk Painting",
    images: [warli],
    price: 1299,
    suggested_price: 1350,
    tags: ["Handmade", "Warli", "Wood", "Tribal Art"],
    status: "published",
    views: 1102,
    orders: 18,
    rating: 4.8,
    created_at: "2026-06-28",
  },
  {
    id: "p5",
    artisan_id: "art_005",
    artisanName: "Meena Soni",
    region: "Jaipur, Rajasthan",
    title: "Oxidised Silver Jhumka Earrings",
    description:
      "Traditional Jaipuri jhumkas in oxidised silver finish with a delicate pearl fringe, light enough for daily wear.",
    story: "Each jhumka is filed, soldered and polished by hand in a Johari Bazaar workshop.",
    category: "Jewelry",
    craft_type: "Silver Filigree",
    images: [jewelry],
    price: 1150,
    suggested_price: 1250,
    tags: ["Handmade", "Silver", "Jhumka", "Rajasthan"],
    status: "low-stock",
    views: 3402,
    orders: 73,
    rating: 4.9,
    created_at: "2026-05-11",
  },
  {
    id: "p6",
    artisan_id: "art_006",
    artisanName: "Kiran Devi",
    region: "Madhubani, Bihar",
    title: "Madhubani Fish & Peacock Wall Art",
    description:
      "Hand-painted Madhubani artwork on handmade paper using natural pigments, framed in solid mango wood.",
    story: "The fish motif is a Mithila symbol of prosperity and good fortune.",
    category: "Paintings",
    craft_type: "Mithila Painting",
    images: [madhubani],
    price: 2499,
    suggested_price: 2499,
    tags: ["Handmade", "Madhubani", "Wall Art", "Bihar"],
    status: "published",
    views: 1976,
    orders: 24,
    rating: 4.8,
    created_at: "2026-07-30",
  },
  {
    id: "p7",
    artisan_id: "art_007",
    artisanName: "Anand Moosari",
    region: "Thrissur, Kerala",
    title: "Engraved Brass Urli Bowl",
    description:
      "A cast brass urli with a hand-engraved rim, used for floating flowers and lamps during festivals.",
    story: "Cast using the traditional Moosari technique passed down in Thrissur.",
    category: "Metal Crafts",
    craft_type: "Brass Casting",
    images: [brass],
    price: 3200,
    suggested_price: 3300,
    tags: ["Handmade", "Brass", "Festive", "Kerala"],
    status: "published",
    views: 745,
    orders: 9,
    rating: 4.7,
    created_at: "2026-08-25",
  },
  {
    id: "p8",
    artisan_id: "art_008",
    artisanName: "Anjali Das",
    region: "Bolpur, West Bengal",
    title: "Kantha Embroidered Cotton Stole",
    description:
      "Soft cotton stole with dense Kantha running-stitch embroidery in indigo on mustard, finished with hand-rolled edges.",
    story: "Kantha began as a way of stitching old saris into new cloth — thrift turned into art.",
    category: "Traditional Décor",
    craft_type: "Kantha Embroidery",
    images: [kantha],
    price: 1750,
    suggested_price: 1800,
    tags: ["Handmade", "Kantha", "Cotton", "Bengal"],
    status: "draft",
    views: 0,
    orders: 0,
    rating: 0,
    created_at: "2026-09-01",
  },
];

export const orders: Order[] = [
  {
    id: "SK-10241",
    product_id: "p1",
    artisan_id: "art_001",
    buyer_id: "b1",
    buyerName: "Aarti Kulkarni",
    buyerCity: "Pune",
    amount: 8499,
    status: "New",
    payment_status: "Paid",
    created_at: "2026-09-05",
  },
  {
    id: "SK-10238",
    product_id: "p5",
    artisan_id: "art_001",
    buyer_id: "b2",
    buyerName: "Rahul Menon",
    buyerCity: "Bengaluru",
    amount: 1150,
    status: "Confirmed",
    payment_status: "Paid",
    created_at: "2026-09-04",
  },
  {
    id: "SK-10230",
    product_id: "p4",
    artisan_id: "art_001",
    buyer_id: "b3",
    buyerName: "Fatima Sheikh",
    buyerCity: "Hyderabad",
    amount: 2598,
    status: "Preparing",
    payment_status: "Paid",
    created_at: "2026-09-02",
  },
  {
    id: "SK-10221",
    product_id: "p2",
    artisan_id: "art_001",
    buyer_id: "b4",
    buyerName: "Devendra Patil",
    buyerCity: "Nashik",
    amount: 1298,
    status: "Shipped",
    payment_status: "Paid",
    created_at: "2026-08-29",
  },
  {
    id: "SK-10209",
    product_id: "p6",
    artisan_id: "art_001",
    buyer_id: "b5",
    buyerName: "Ishita Roy",
    buyerCity: "Kolkata",
    amount: 2499,
    status: "Delivered",
    payment_status: "Paid",
    created_at: "2026-08-21",
  },
];

export const inquiries: Inquiry[] = [
  {
    id: "q1",
    artisan_id: "art_001",
    buyer_id: "b6",
    buyerName: "Priya Nair",
    product_id: "p1",
    unread: true,
    status: "open",
    created_at: "2026-09-05",
    messages: [
      { from: "buyer", text: "Namaste! Is this available in another size?", time: "10:24 AM" },
      { from: "buyer", text: "I need it before the wedding on 20th.", time: "10:25 AM" },
    ],
  },
  {
    id: "q2",
    artisan_id: "art_001",
    buyer_id: "b7",
    buyerName: "Sameer Joshi",
    product_id: "p4",
    unread: true,
    status: "open",
    created_at: "2026-09-04",
    messages: [
      { from: "buyer", text: "Can you make 20 trays for corporate gifting?", time: "6:10 PM" },
    ],
  },
  {
    id: "q3",
    artisan_id: "art_001",
    buyer_id: "b8",
    buyerName: "Neha Agarwal",
    product_id: "p2",
    unread: false,
    status: "answered",
    created_at: "2026-09-01",
    messages: [
      { from: "buyer", text: "Are the diyas safe with oil wicks?", time: "9:02 AM" },
      {
        from: "artisan",
        text: "Namaste! Yes, they are kiln-fired terracotta and completely safe with oil wicks.",
        time: "9:40 AM",
      },
      { from: "buyer", text: "Wonderful, ordering 4 sets.", time: "9:44 AM" },
    ],
  },
];

export const transactions: Transaction[] = [
  {
    id: "TX-88120",
    artisan_id: "art_001",
    order_id: "SK-10241",
    productTitle: "Paithani Silk Saree",
    buyerName: "Aarti Kulkarni",
    amount: 8499,
    status: "Processing",
    created_at: "2026-09-05",
  },
  {
    id: "TX-88104",
    artisan_id: "art_001",
    order_id: "SK-10238",
    productTitle: "Oxidised Silver Jhumka",
    buyerName: "Rahul Menon",
    amount: 1150,
    status: "Settled",
    created_at: "2026-09-04",
  },
  {
    id: "TX-88077",
    artisan_id: "art_001",
    order_id: "SK-10230",
    productTitle: "Warli Wooden Tray",
    buyerName: "Fatima Sheikh",
    amount: 2598,
    status: "Settled",
    created_at: "2026-09-02",
  },
  {
    id: "TX-88031",
    artisan_id: "art_001",
    order_id: "SK-10221",
    productTitle: "Terracotta Diya Set",
    buyerName: "Devendra Patil",
    amount: 1298,
    status: "Settled",
    created_at: "2026-08-29",
  },
  {
    id: "TX-87990",
    artisan_id: "art_001",
    order_id: "SK-10209",
    productTitle: "Madhubani Wall Art",
    buyerName: "Ishita Roy",
    amount: 2499,
    status: "Pending",
    created_at: "2026-08-21",
  },
];

export const earningsByMonth = [
  { month: "Apr", amount: 12400 },
  { month: "May", amount: 18600 },
  { month: "Jun", amount: 15200 },
  { month: "Jul", amount: 24800 },
  { month: "Aug", amount: 31200 },
  { month: "Sep", amount: 16044 },
];

export const categories = [
  "Pottery",
  "Handwoven Textiles",
  "Wooden Crafts",
  "Paintings",
  "Jewelry",
  "Bamboo Crafts",
  "Metal Crafts",
  "Traditional Décor",
];

export function formatINR(value: number) {
  return "₹" + value.toLocaleString("en-IN");
}

export function productById(id: string, extra: Product[] = []) {
  return [...extra, ...products].find((p) => p.id === id);
}
