# =============================================================
# Drift & Co. — Seed Data
# Populates the database with 24 sample products, categories,
# an admin user, and sample reviews on first startup.
# Run by calling seed_database() from main.py.
# =============================================================
from database import SessionLocal
from models import Category, User, Product, Review
from auth_utils import hash_password

# All 24 products from the frontend (matching src/data/products.ts)
SEED_PRODUCTS = [
    # ---- Men (8) ----
    {"name": "Classic Cotton Round-Neck T-Shirt", "price": 499, "category": "T-Shirts", "gender": "men", "image": "https://images.pexels.com/photos/1389077/pexels-photo-1389077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Soft combed cotton crew-neck tee in a regular fit. Breathable and comfortable for everyday Indian weather.", "sizes": "S,M,L,XL,XXL", "colors": "Black,White,Navy Blue,Olive", "rating": 4.5, "review_count": 128, "trending": True, "new_arrival": False, "stock": 45},
    {"name": "Premium Turtleneck Sweater", "price": 1299, "category": "Sweaters", "gender": "men", "image": "https://images.pexels.com/photos/10482937/pexels-photo-10482937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Fine-knit turtleneck sweater ideal for winter layering. Soft-touch fabric with a slim silhouette.", "sizes": "M,L,XL", "colors": "Charcoal,Black,Beige", "rating": 4.7, "review_count": 89, "trending": True, "new_arrival": True, "stock": 30},
    {"name": "Slim-Fit Denim Jacket", "price": 1999, "category": "Jackets", "gender": "men", "image": "https://images.pexels.com/photos/6764727/pexels-photo-6764727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Classic denim jacket with a tailored slim fit. A versatile wardrobe staple.", "sizes": "M,L,XL", "colors": "Indigo,Black", "rating": 4.6, "review_count": 203, "trending": False, "new_arrival": True, "stock": 22},
    {"name": "Genuine Leather Biker Jacket", "price": 4999, "category": "Jackets", "gender": "men", "image": "https://images.pexels.com/photos/17783369/pexels-photo-17783369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Full-grain leather biker jacket with quilted shoulders and silver hardware.", "sizes": "M,L,XL", "colors": "Black,Brown", "rating": 4.8, "review_count": 67, "trending": True, "new_arrival": False, "stock": 12},
    {"name": "Embroidered Pathani Kurta Set", "price": 1799, "category": "Kurtas", "gender": "men", "image": "https://images.pexels.com/photos/15745642/pexels-photo-15745642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Traditional Pathani kurta with churidar in breathable cotton. Subtle embroidery on the placket.", "sizes": "38,40,42,44", "colors": "Off-White,Maroon,Black", "rating": 4.9, "review_count": 45, "trending": False, "new_arrival": True, "stock": 8},
    {"name": "Formal Office Shirt", "price": 899, "category": "Shirts", "gender": "men", "image": "https://images.pexels.com/photos/21997937/pexels-photo-21997937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Crisp formal shirt in wrinkle-resistant cotton blend. Tailored slim fit with a spread collar.", "sizes": "38,40,42,44", "colors": "White,Sky Blue,Black", "rating": 4.4, "review_count": 34, "trending": False, "new_arrival": False, "stock": 18},
    {"name": "Graphic Print Oversized Tee", "price": 699, "category": "T-Shirts", "gender": "men", "image": "https://images.pexels.com/photos/1389077/pexels-photo-1389077.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Trendy oversized fit tee with a bold graphic print. Drop-shoulder design in 100% cotton.", "sizes": "S,M,L,XL,XXL", "colors": "White,Grey,Black", "rating": 4.3, "review_count": 156, "trending": False, "new_arrival": True, "stock": 60},
    {"name": "Slim-Fit Stretch Jeans", "price": 1499, "category": "Jeans", "gender": "men", "image": "https://images.pexels.com/photos/6764727/pexels-photo-6764727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Slim-fit jeans with comfortable stretch denim. Mid-rise waist and classic five-pocket styling.", "sizes": "30,32,34,36,38", "colors": "Dark Blue,Black,Grey", "rating": 4.5, "review_count": 98, "trending": True, "new_arrival": False, "stock": 35},
    # ---- Women (8) ----
    {"name": "Anarkali Kurti Set", "price": 1499, "category": "Kurtis", "gender": "women", "image": "https://images.pexels.com/photos/19674580/pexels-photo-19674580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Flowy Anarkali kurti with palazzo and dupatta set. Lightweight rayon fabric with floral prints.", "sizes": "XS,S,M,L,XL", "colors": "Pink,Teal,Maroon", "rating": 4.6, "review_count": 112, "trending": True, "new_arrival": True, "stock": 40},
    {"name": "Banarasi Silk Saree", "price": 3499, "category": "Sarees", "gender": "women", "image": "https://images.pexels.com/photos/29850173/pexels-photo-29850173.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Elegant Banarasi silk saree with zari border and woven motifs. Comes with an unstitched blouse piece.", "sizes": "Free Size", "colors": "Red,Royal Blue,Green", "rating": 4.8, "review_count": 187, "trending": True, "new_arrival": False, "stock": 25},
    {"name": "Oversized Blazer", "price": 2299, "category": "Jackets", "gender": "women", "image": "https://images.pexels.com/photos/31674936/pexels-photo-31674936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Oversized blazer with structured shoulders and a relaxed fit. A modern essential.", "sizes": "S,M,L,XL", "colors": "Beige,Black,Grey", "rating": 4.7, "review_count": 76, "trending": False, "new_arrival": True, "stock": 20},
    {"name": "Embroidered Jacket Kurti", "price": 1899, "category": "Kurtis", "gender": "women", "image": "https://images.pexels.com/photos/22601729/pexels-photo-22601729.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Stylish jacket-style kurti with intricate embroidery. A versatile piece for office or evening wear.", "sizes": "S,M,L,XL", "colors": "Black,White,Mustard", "rating": 4.5, "review_count": 54, "trending": True, "new_arrival": False, "stock": 15},
    {"name": "Floral Midi Dress", "price": 1299, "category": "Dresses", "gender": "women", "image": "https://images.pexels.com/photos/28698706/pexels-photo-28698706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A flowing midi dress in a striking floral print. Lightweight fabric with a flattering A-line cut.", "sizes": "XS,S,M,L", "colors": "Blue,Teal,Coral", "rating": 4.6, "review_count": 143, "trending": True, "new_arrival": True, "stock": 28},
    {"name": "Cozy Knit Co-ord Set", "price": 1699, "category": "Tops", "gender": "women", "image": "https://images.pexels.com/photos/19220820/pexels-photo-19220820.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A cozy knit co-ord set featuring a cropped sweater and matching bottoms.", "sizes": "S,M,L,XL", "colors": "Grey,Cream,Camel", "rating": 4.4, "review_count": 67, "trending": False, "new_arrival": True, "stock": 33},
    {"name": "High-Waist Skinny Jeans", "price": 1399, "category": "Jeans", "gender": "women", "image": "https://images.pexels.com/photos/31674936/pexels-photo-31674936.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "High-waist skinny jeans with stretch denim for a comfortable, sculpting fit.", "sizes": "26,28,30,32,34", "colors": "Blue,Black,Light Blue", "rating": 4.5, "review_count": 210, "trending": True, "new_arrival": False, "stock": 50},
    {"name": "Silk-Blend Wrap Top", "price": 1099, "category": "Tops", "gender": "women", "image": "https://images.pexels.com/photos/19674580/pexels-photo-19674580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Luxurious silk-blend wrap top with adjustable tie closure. Effortlessly elegant.", "sizes": "XS,S,M,L", "colors": "Ivory,Burgundy,Emerald", "rating": 4.7, "review_count": 92, "trending": False, "new_arrival": True, "stock": 26},
    # ---- Kids (8) ----
    {"name": "Boys' Sherwani Set", "price": 2499, "category": "Ethnic Wear", "gender": "kids", "image": "https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A dapper sherwani set for little gentlemen. Includes kurta, churidar, and jacket.", "sizes": "2-3Y,4-5Y,6-7Y,8-9Y", "colors": "Cream,Maroon", "rating": 4.6, "review_count": 45, "trending": True, "new_arrival": True, "stock": 20},
    {"name": "Kids' Denim Jacket Set", "price": 1099, "category": "Jackets", "gender": "kids", "image": "https://images.pexels.com/photos/38778561/pexels-photo-38778561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A fun denim outfit set for kids. Cool, comfortable, and ready for playground adventures.", "sizes": "3-4Y,5-6Y,7-8Y,9-10Y", "colors": "Blue,Light Blue", "rating": 4.7, "review_count": 38, "trending": True, "new_arrival": False, "stock": 30},
    {"name": "Padded Winter Coat", "price": 1599, "category": "Jackets", "gender": "kids", "image": "https://images.pexels.com/photos/35078823/pexels-photo-35078823.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Warm padded winter coat with a cozy hood. Keeps little ones snug and stylish.", "sizes": "3-4Y,5-6Y,7-8Y,9-10Y", "colors": "Black,Red,Navy", "rating": 4.8, "review_count": 56, "trending": False, "new_arrival": True, "stock": 24},
    {"name": "Nautical Striped T-Shirt Set", "price": 799, "category": "T-Shirts", "gender": "kids", "image": "https://images.pexels.com/photos/1620759/pexels-photo-1620759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A charming nautical-themed outfit set. Striped top with matching bottoms.", "sizes": "2-3Y,4-5Y,6-7Y,8-9Y", "colors": "Navy,White,Red", "rating": 4.5, "review_count": 29, "trending": True, "new_arrival": False, "stock": 18},
    {"name": "Girls' Lehenga Choli", "price": 2199, "category": "Ethnic Wear", "gender": "kids", "image": "https://images.pexels.com/photos/34608858/pexels-photo-34608858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A vibrant lehenga choli in soft green with beautiful embellishments.", "sizes": "2-3Y,4-5Y,6-7Y,8-9Y", "colors": "Green,Pink,Yellow", "rating": 4.6, "review_count": 22, "trending": False, "new_arrival": True, "stock": 16},
    {"name": "Boys' Smart Shirt & Waistcoat", "price": 1199, "category": "Shirts", "gender": "kids", "image": "https://images.pexels.com/photos/30690920/pexels-photo-30690920.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A smart-casual shirt and waistcoat combo for young trendsetters.", "sizes": "4-5Y,6-7Y,8-9Y,10-11Y", "colors": "Grey,Black,Beige", "rating": 4.4, "review_count": 18, "trending": False, "new_arrival": True, "stock": 14},
    {"name": "Playtime Cotton Tee", "price": 349, "category": "T-Shirts", "gender": "kids", "image": "https://images.pexels.com/photos/30690921/pexels-photo-30690921.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "A soft cotton tee designed for active kids. Breathable fabric and a relaxed fit.", "sizes": "2-3Y,4-5Y,6-7Y,8-9Y,10-11Y", "colors": "Blue,Red,Yellow", "rating": 4.3, "review_count": 67, "trending": True, "new_arrival": False, "stock": 55},
    {"name": "Kids' Straight-Fit Jeans", "price": 699, "category": "Jeans", "gender": "kids", "image": "https://images.pexels.com/photos/38778561/pexels-photo-38778561.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "description": "Durable straight-fit jeans with an adjustable waistband for growing kids.", "sizes": "4-5Y,6-7Y,8-9Y,10-11Y,12-13Y", "colors": "Blue,Dark Blue", "rating": 4.5, "review_count": 41, "trending": False, "new_arrival": True, "stock": 38},
]

# Sample reviews matching the frontend
SEED_REVIEWS = [
    {"product_id": 1, "author": "Rahul Sharma", "rating": 5, "comment": "Perfect fit and the fabric quality is amazing for the price. My new go-to tee for daily wear!"},
    {"product_id": 1, "author": "Priya Patel", "rating": 4, "comment": "Great t-shirt, runs slightly large so size down if you want a snug fit. Cotton is soft."},
    {"product_id": 2, "author": "Arjun Mehta", "rating": 5, "comment": "The sweater is incredibly soft and looks very premium. Perfect for Delhi winters. Highly recommend."},
    {"product_id": 3, "author": "Sneha Reddy", "rating": 5, "comment": "Best denim jacket I've owned. The slim fit is exactly what I wanted. Great quality at this price."},
    {"product_id": 4, "author": "Vikram Singh", "rating": 5, "comment": "The leather quality is outstanding. Worth every rupee — looks better with every wear."},
    {"product_id": 5, "author": "Amit Kumar", "rating": 5, "comment": "Wore it for Diwali and got so many compliments. The embroidery is beautiful and fabric is comfortable."},
    {"product_id": 9, "author": "Ananya Iyer", "rating": 5, "comment": "So comfortable and flattering. I get compliments every time I wear it. The print is lovely."},
    {"product_id": 10, "author": "Deepika Nair", "rating": 5, "comment": "The saree is gorgeous. The zari work is exquisite and it drapes beautifully. Perfect for weddings."},
    {"product_id": 13, "author": "Kavya Rao", "rating": 4, "comment": "Beautiful dress and flow. Wish it came in more sizes though. Fabric is perfect for summer."},
    {"product_id": 17, "author": "Pooja Gupta", "rating": 5, "comment": "My son looked so handsome in this sherwani! Great quality for the price. Perfect for the wedding season."},
    {"product_id": 19, "author": "Fatima Sheikh", "rating": 5, "comment": "Keeps my daughter warm and she loves wearing it. The hood is a great touch. Good quality padding."},
    {"product_id": 21, "author": "Meera Joshi", "rating": 5, "comment": "The lehenga is stunning! Beautiful colours and the embellishments are well done. My daughter loves it."},
]


def seed_database():
    """
    Insert seed data (admin user, categories, products, reviews)
    if the database is empty. Safe to call on every startup.
    """
    db = SessionLocal()
    try:
        # Skip if products already exist
        if db.query(Product).count() > 0:
            return

        # ---- Create admin user ----
        admin = User(
            name="Admin",
            email="admin@driftandco.com",
            password=hash_password("admin123"),
            role="admin",
        )
        db.add(admin)

        # ---- Create demo user ----
        demo_user = User(
            name="Rahul Sharma",
            email="rahul@example.com",
            password=hash_password("pass123"),
            role="user",
        )
        db.add(demo_user)
        db.flush()  # flush to get IDs

        # ---- Create categories ----
        # Categories are shared across genders; product gender is stored separately.
        cat_names = {p["category"] for p in SEED_PRODUCTS}
        cat_map = {}
        for cat_name in cat_names:
            cat = db.query(Category).filter(Category.name == cat_name).first()
            if not cat:
                gender = next(p["gender"] for p in SEED_PRODUCTS if p["category"] == cat_name)
                cat = Category(name=cat_name, gender=gender)
                db.add(cat)
            cat_map[cat_name] = cat
        db.flush()

        # ---- Create products ----
        for p in SEED_PRODUCTS:
            product = Product(
                name=p["name"],
                price=p["price"],
                category_id=cat_map[p["category"]].id,
                gender=p["gender"],
                image=p["image"],
                description=p["description"],
                sizes=p["sizes"],
                colors=p["colors"],
                rating=p["rating"],
                review_count=p["review_count"],
                trending=p["trending"],
                new_arrival=p["new_arrival"],
                stock=p["stock"],
            )
            db.add(product)
        db.flush()

        # ---- Create reviews ----
        for r in SEED_REVIEWS:
            review = Review(
                product_id=r["product_id"],
                author=r["author"],
                rating=r["rating"],
                comment=r["comment"],
            )
            db.add(review)

        db.commit()
        print(f"Seed data inserted: {len(SEED_PRODUCTS)} products, {len(SEED_REVIEWS)} reviews, 1 admin user")
    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
    finally:
        db.close()
