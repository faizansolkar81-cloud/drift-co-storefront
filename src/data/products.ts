// =============================================================
// Drift & Co. — Sample Product Catalog
// 24 realistic Indian clothing products with INR prices:
// 8 Men, 8 Women, 8 Kids. Categories, sizes, colors, ratings,
// and stock all reflect a typical Indian fashion store.
// In a real backend these rows would live in a MySQL `products`
// table served by FastAPI.
// =============================================================
import type { Product, Review } from "@/types";

// ---- Image URLs (from Pexels — free-to-use stock photos) ----
const IMG = {
  // Men
  menTshirt: "https://images.pexels.com/photos/1389077/pexels-photo-1389077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  menShirt: "https://images.pexels.com/photos/10482937/pexels-photo-10482937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  menJeans: "https://images.pexels.com/photos/6764727/pexels-photo-6764727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  menJacket: "https://images.pexels.com/photos/17783369/pexels-photo-17783369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  menKurta: "https://images.pexels.com/photos/15745642/pexels-photo-15745642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  menBlack: "https://images.pexels.com/photos/21997937/pexels-photo-21997937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  // Women
  womenKurta: "https://images.pexels.com/photos/19674580/pexels-photo-19674580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  womenSaree: "https://images.pexels.com/photos/29850173/pexels-photo-29850173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  womenJeans: "https://images.pexels.com/photos/31674936/pexels-photo-31674936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  womenJacket: "https://images.pexels.com/photos/22601729/pexels-photo-22601729.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  womenBlue: "https://images.pexels.com/photos/28698706/pexels-photo-28698706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  womenKnit: "https://images.pexels.com/photos/19220820/pexels-photo-19220820.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  // Kids
  kidsBoy: "https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  kidsDenim: "https://images.pexels.com/photos/38778561/pexels-photo-38778561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  kidsCoat: "https://images.pexels.com/photos/35078823/pexels-photo-35078823.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  kidsNautical: "https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  kidsGreen: "https://images.pexels.com/photos/34608858/pexels-photo-34608858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  kidsSuit: "https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

export const products: Product[] = [
  // ---------------- MEN (8 products) ----------------
  { id: 1, name: "Classic Cotton Round-Neck T-Shirt", price: 499, category: "T-Shirts", gender: "men", image: IMG.menTshirt, description: "Soft combed cotton crew-neck tee in a regular fit. Breathable and comfortable for everyday Indian weather — pairs effortlessly with jeans or chinos.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "White", "Navy Blue", "Olive"], rating: 4.5, reviewCount: 128, trending: true, newArrival: false, stock: 45 },
  { id: 2, name: "Premium Turtleneck Sweater", price: 1299, category: "Sweaters", gender: "men", image: IMG.menShirt, description: "Fine-knit turtleneck sweater ideal for winter layering. Soft-touch fabric with a slim silhouette — perfect for office or evening outings.", sizes: ["M", "L", "XL"], colors: ["Charcoal", "Black", "Beige"], rating: 4.7, reviewCount: 89, trending: true, newArrival: true, stock: 30 },
  { id: 3, name: "Slim-Fit Denim Jacket", price: 1999, category: "Jackets", gender: "men", image: IMG.menJeans, description: "Classic denim jacket with a tailored slim fit. A versatile wardrobe staple that pairs with kurtas, tees, or shirts for a smart-casual look.", sizes: ["M", "L", "XL"], colors: ["Indigo", "Black"], rating: 4.6, reviewCount: 203, trending: false, newArrival: true, stock: 22 },
  { id: 4, name: "Genuine Leather Biker Jacket", price: 4999, category: "Jackets", gender: "men", image: IMG.menJacket, description: "Full-grain leather biker jacket with quilted shoulders and silver hardware. A bold statement piece built to last for years.", sizes: ["M", "L", "XL"], colors: ["Black", "Brown"], rating: 4.8, reviewCount: 67, trending: true, newArrival: false, stock: 12 },
  { id: 5, name: "Embroidered Pathani Kurta Set", price: 1799, category: "Kurtas", gender: "men", image: IMG.menKurta, description: "Traditional Pathani kurta with churidar in breathable cotton. Subtle embroidery on the placket makes it perfect for festivals and family gatherings.", sizes: ["38", "40", "42", "44"], colors: ["Off-White", "Maroon", "Black"], rating: 4.9, reviewCount: 45, trending: false, newArrival: true, stock: 8 },
  { id: 6, name: "Formal Office Shirt", price: 899, category: "Shirts", gender: "men", image: IMG.menBlack, description: "Crisp formal shirt in wrinkle-resistant cotton blend. Tailored slim fit with a spread collar — ideal for daily office wear.", sizes: ["38", "40", "42", "44"], colors: ["White", "Sky Blue", "Black"], rating: 4.4, reviewCount: 34, trending: false, newArrival: false, stock: 18 },
  { id: 7, name: "Graphic Print Oversized Tee", price: 699, category: "T-Shirts", gender: "men", image: IMG.menTshirt, description: "Trendy oversized fit tee with a bold graphic print. Drop-shoulder design in 100% cotton — a streetwear favourite for Gen Z.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["White", "Grey", "Black"], rating: 4.3, reviewCount: 156, trending: false, newArrival: true, stock: 60 },
  { id: 8, name: "Slim-Fit Stretch Jeans", price: 1499, category: "Jeans", gender: "men", image: IMG.menJeans, description: "Slim-fit jeans with comfortable stretch denim. Mid-rise waist and classic five-pocket styling for all-day wear.", sizes: ["30", "32", "34", "36", "38"], colors: ["Dark Blue", "Black", "Grey"], rating: 4.5, reviewCount: 98, trending: true, newArrival: false, stock: 35 },

  // ---------------- WOMEN (8 products) ----------------
  { id: 9, name: "Anarkali Kurti Set", price: 1499, category: "Kurtis", gender: "women", image: IMG.womenKurta, description: "Flowy Anarkali kurti with palazzo and dupatta set. Lightweight rayon fabric with floral prints — perfect for festive occasions and daily wear.", sizes: ["XS", "S", "M", "L", "XL"], colors: ["Pink", "Teal", "Maroon"], rating: 4.6, reviewCount: 112, trending: true, newArrival: true, stock: 40 },
  { id: 10, name: "Banarasi Silk Saree", price: 3499, category: "Sarees", gender: "women", image: IMG.womenSaree, description: "Elegant Banarasi silk saree with zari border and woven motifs. Comes with an unstitched blouse piece — a timeless choice for weddings and festivals.", sizes: ["Free Size"], colors: ["Red", "Royal Blue", "Green"], rating: 4.8, reviewCount: 187, trending: true, newArrival: false, stock: 25 },
  { id: 11, name: "Oversized Blazer", price: 2299, category: "Jackets", gender: "women", image: IMG.womenJeans, description: "Oversized blazer with structured shoulders and a relaxed fit. A modern essential that elevates any outfit — pair with jeans or a dress.", sizes: ["S", "M", "L", "XL"], colors: ["Beige", "Black", "Grey"], rating: 4.7, reviewCount: 76, trending: false, newArrival: true, stock: 20 },
  { id: 12, name: "Embroidered Jacket Kurti", price: 1899, category: "Kurtis", gender: "women", image: IMG.womenJacket, description: "Stylish jacket-style kurti with intricate embroidery. A versatile piece that transitions effortlessly from office to evening wear.", sizes: ["S", "M", "L", "XL"], colors: ["Black", "White", "Mustard"], rating: 4.5, reviewCount: 54, trending: true, newArrival: false, stock: 15 },
  { id: 13, name: "Floral Midi Dress", price: 1299, category: "Dresses", gender: "women", image: IMG.womenBlue, description: "A flowing midi dress in a striking floral print. Lightweight fabric with a flattering A-line cut that moves beautifully with every step.", sizes: ["XS", "S", "M", "L"], colors: ["Blue", "Teal", "Coral"], rating: 4.6, reviewCount: 143, trending: true, newArrival: true, stock: 28 },
  { id: 14, name: "Cozy Knit Co-ord Set", price: 1699, category: "Tops", gender: "women", image: IMG.womenKnit, description: "A cozy knit co-ord set featuring a cropped sweater and matching bottoms. Perfect for winter lounging in style or casual outings.", sizes: ["S", "M", "L", "XL"], colors: ["Grey", "Cream", "Camel"], rating: 4.4, reviewCount: 67, trending: false, newArrival: true, stock: 33 },
  { id: 15, name: "High-Waist Skinny Jeans", price: 1399, category: "Jeans", gender: "women", image: IMG.womenJeans, description: "High-waist skinny jeans with stretch denim for a comfortable, sculpting fit. A versatile everyday essential for every wardrobe.", sizes: ["26", "28", "30", "32", "34"], colors: ["Blue", "Black", "Light Blue"], rating: 4.5, reviewCount: 210, trending: true, newArrival: false, stock: 50 },
  { id: 16, name: "Silk-Blend Wrap Top", price: 1099, category: "Tops", gender: "women", image: IMG.womenKurta, description: "Luxurious silk-blend wrap top with adjustable tie closure. Effortlessly elegant for both work and evening wear.", sizes: ["XS", "S", "M", "L"], colors: ["Ivory", "Burgundy", "Emerald"], rating: 4.7, reviewCount: 92, trending: false, newArrival: true, stock: 26 },

  // ---------------- KIDS (8 products) ----------------
  { id: 17, name: "Boys' Sherwani Set", price: 2499, category: "Ethnic Wear", gender: "kids", image: IMG.kidsBoy, description: "A dapper sherwani set for little gentlemen. Includes kurta, churidar, and jacket in comfortable, easy-care fabric for weddings and festivals.", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Cream", "Maroon"], rating: 4.6, reviewCount: 45, trending: true, newArrival: true, stock: 20 },
  { id: 18, name: "Kids' Denim Jacket Set", price: 1099, category: "Jackets", gender: "kids", image: IMG.kidsDenim, description: "A fun denim outfit set for kids. Cool, comfortable, and ready for playground adventures — includes jacket and matching jeans.", sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"], colors: ["Blue", "Light Blue"], rating: 4.7, reviewCount: 38, trending: true, newArrival: false, stock: 30 },
  { id: 19, name: "Padded Winter Coat", price: 1599, category: "Jackets", gender: "kids", image: IMG.kidsCoat, description: "Warm padded winter coat with a cozy hood. Keeps little ones snug and stylish through the coldest months — lightweight yet insulated.", sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"], colors: ["Black", "Red", "Navy"], rating: 4.8, reviewCount: 56, trending: false, newArrival: true, stock: 24 },
  { id: 20, name: "Nautical Striped T-Shirt Set", price: 799, category: "T-Shirts", gender: "kids", image: IMG.kidsNautical, description: "A charming nautical-themed outfit set. Striped top with matching bottoms for adorable everyday style — soft cotton blend.", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Navy", "White", "Red"], rating: 4.5, reviewCount: 29, trending: true, newArrival: false, stock: 18 },
  { id: 21, name: "Girls' Lehenga Choli", price: 2199, category: "Ethnic Wear", gender: "kids", image: IMG.kidsGreen, description: "A vibrant lehenga choli in soft green with beautiful embellishments. Perfect for weddings, festivals, and special occasions.", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Green", "Pink", "Yellow"], rating: 4.6, reviewCount: 22, trending: false, newArrival: true, stock: 16 },
  { id: 22, name: "Boys' Smart Shirt & Waistcoat", price: 1199, category: "Shirts", gender: "kids", image: IMG.kidsSuit, description: "A smart-casual shirt and waistcoat combo for young trendsetters. Versatile enough for parties, photos, and special days.", sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Grey", "Black", "Beige"], rating: 4.4, reviewCount: 18, trending: false, newArrival: true, stock: 14 },
  { id: 23, name: "Playtime Cotton Tee", price: 349, category: "T-Shirts", gender: "kids", image: IMG.kidsBoy, description: "A soft cotton tee designed for active kids. Breathable fabric and a relaxed fit for all-day comfort and fun — available in bright colours.", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Blue", "Red", "Yellow"], rating: 4.3, reviewCount: 67, trending: true, newArrival: false, stock: 55 },
  { id: 24, name: "Kids' Straight-Fit Jeans", price: 699, category: "Jeans", gender: "kids", image: IMG.kidsDenim, description: "Durable straight-fit jeans with an adjustable waistband for growing kids. Classic five-pocket styling in soft stretch denim.", sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"], colors: ["Blue", "Dark Blue"], rating: 4.5, reviewCount: 41, trending: false, newArrival: true, stock: 38 },
];

// ---- Sample reviews for the Product Details page ----
// Reviews use Indian names and reference Indian clothing context.
export const seedReviews: Review[] = [
  { id: 1, productId: 1, author: "Rahul Sharma", rating: 5, date: "2026-08-15", comment: "Perfect fit and the fabric quality is amazing for the price. My new go-to tee for daily wear!" },
  { id: 2, productId: 1, author: "Priya Patel", rating: 4, date: "2026-08-02", comment: "Great t-shirt, runs slightly large so size down if you want a snug fit. Cotton is soft." },
  { id: 3, productId: 2, author: "Arjun Mehta", rating: 5, date: "2026-08-20", comment: "The sweater is incredibly soft and looks very premium. Perfect for Delhi winters. Highly recommend." },
  { id: 4, productId: 3, author: "Sneha Reddy", rating: 5, date: "2026-07-28", comment: "Best denim jacket I've owned. The slim fit is exactly what I wanted. Great quality at this price." },
  { id: 5, productId: 4, author: "Vikram Singh", rating: 5, date: "2026-08-10", comment: "The leather quality is outstanding. Worth every rupee — looks better with every wear." },
  { id: 6, productId: 5, author: "Amit Kumar", rating: 5, date: "2026-08-25", comment: "Wore it for Diwali and got so many compliments. The embroidery is beautiful and fabric is comfortable." },
  { id: 7, productId: 9, author: "Ananya Iyer", rating: 5, date: "2026-08-18", comment: "So comfortable and flattering. I get compliments every time I wear it. The print is lovely." },
  { id: 8, productId: 10, author: "Deepika Nair", rating: 5, date: "2026-08-05", comment: "The saree is gorgeous. The zari work is exquisite and it drapes beautifully. Perfect for weddings." },
  { id: 9, productId: 13, author: "Kavya Rao", rating: 4, date: "2026-08-22", comment: "Beautiful dress and flow. Wish it came in more sizes though. Fabric is perfect for summer." },
  { id: 10, productId: 17, author: "Pooja Gupta", rating: 5, date: "2026-08-12", comment: "My son looked so handsome in this sherwani! Great quality for the price. Perfect for the wedding season." },
  { id: 11, productId: 19, author: "Fatima Sheikh", rating: 5, date: "2026-08-01", comment: "Keeps my daughter warm and she loves wearing it. The hood is a great touch. Good quality padding." },
  { id: 12, productId: 21, author: "Meera Joshi", rating: 5, date: "2026-08-19", comment: "The lehenga is stunning! Beautiful colours and the embellishments are well done. My daughter loves it." },
];
