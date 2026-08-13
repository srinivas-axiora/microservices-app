package com.example.catalog.config;

import com.example.catalog.model.Category;
import com.example.catalog.model.Product;
import com.example.catalog.model.User;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
import com.example.catalog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed default admin user if not exists
        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
            userRepository.save(new User("admin@admin.com", "admin", "Admin User"));
            System.out.println("Default user 'admin@admin.com' seeded successfully.");
        }

        // If products are already 36, no re-seeding needed
        if (productRepository.count() == 36) {
            System.out.println("Catalog database already contains 36 products. Skipping seeding.");
            return;
        }

        System.out.println("Clearing old 17 items and seeding 36 new Flipkart-style products...");

        // Wipe old records in proper foreign-key order using batch deletion
        productRepository.deleteAllInBatch();
        categoryRepository.deleteAllInBatch();

        // 1. Save 9 Flipkart Categories
        Category grocery = categoryRepository.save(new Category("Grocery", "Daily essentials, staples and snacks", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"));
        Category mobiles = categoryRepository.save(new Category("Mobiles", "Smartphones, accessories and tablets", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200"));
        Category fashion = categoryRepository.save(new Category("Fashion", "Men, women clothing and footwear", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200"));
        Category electronics = categoryRepository.save(new Category("Electronics", "Laptops, audio and smart gadgets", "https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=200"));
        Category homeFurniture = categoryRepository.save(new Category("Home & Furniture", "Home decor, furniture and essentials", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200"));
        Category appliances = categoryRepository.save(new Category("Appliances", "TVs, refrigerators and washing machines", "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=200"));
        Category flights = categoryRepository.save(new Category("Flight Booking", "Domestic & international flight deals", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200"));
        Category toysBeauty = categoryRepository.save(new Category("Toys, Beauty & More", "Toys, cosmetics and personal care", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200"));
        Category twoWheelers = categoryRepository.save(new Category("Two Wheelers", "Electric bikes, scooters and gear", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200"));

        // 2. Save 36 New Products
        List<Product> products = Arrays.asList(
            // Mobiles & Tablets (5)
            new Product("iPhone 15 Pro Max 256GB", "A17 Pro chip, Titanium design, 48MP camera system.", new BigDecimal("1199.00"), 50, mobiles.getId(), "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"),
            new Product("Samsung Galaxy S24 Ultra", "Galaxy AI, 200MP camera, Snapdragon 8 Gen 3.", new BigDecimal("1299.99"), 40, mobiles.getId(), "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"),
            new Product("OnePlus 12 5G Smooth Green", "Snapdragon 8 Gen 3, 100W SuperVOOC fast charging.", new BigDecimal("799.00"), 65, mobiles.getId(), "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"),
            new Product("Google Pixel 8 Pro 128GB Bay Blue", "Tensor G3 processor, pro-level AI photography.", new BigDecimal("999.00"), 45, mobiles.getId(), "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"),
            new Product("Apple iPad Air 10.9-inch M1", "Liquid Retina display, M1 chip, 64GB Wi-Fi.", new BigDecimal("599.00"), 35, mobiles.getId(), "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"),

            // Fashion & Lifestyle (8)
            new Product("Men's Red Lightweight Bomber Jacket", "Water-resistant windbreaker sport jacket with zip front.", new BigDecimal("49.99"), 120, fashion.getId(), "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"),
            new Product("Classic White Street Sneakers", "Trendy white leather urban sneakers with rubber soles.", new BigDecimal("59.99"), 150, fashion.getId(), "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"),
            new Product("Women's Stylish Denim Jacket", "Classic vintage wash denim jacket with buttoned pockets.", new BigDecimal("64.50"), 80, fashion.getId(), "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600"),
            new Product("Slim Fit Cotton Oxford Shirt", "Breathable organic cotton formal button-down shirt.", new BigDecimal("39.90"), 95, fashion.getId(), "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"),
            new Product("Women's Floral Summer Maxi Dress", "Lightweight bohemian print maxi dress with waist tie.", new BigDecimal("45.99"), 110, fashion.getId(), "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"),
            new Product("Slim Fit Stretch Denim Jeans", "Durable stretch denim jeans with modern slim fit cut.", new BigDecimal("54.90"), 85, fashion.getId(), "https://images.unsplash.com/photo-1542272604-780c36856d67?w=600"),
            new Product("Premium Polarized Aviator Sunglasses", "UV400 protection metal frame classic aviator shades.", new BigDecimal("29.99"), 200, fashion.getId(), "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"),
            new Product("Genuine Leather Crossbody Shoulder Bag", "Handcrafted Italian leather handbag with adjustable strap.", new BigDecimal("69.00"), 60, fashion.getId(), "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"),

            // Electronics & Gadgets (7)
            new Product("Sony WH-1000XM5 Wireless Headphones", "Industry leading noise canceling over-ear headphones.", new BigDecimal("348.00"), 75, electronics.getId(), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"),
            new Product("MacBook Pro 16 M3 Max", "16-inch Liquid Retina XDR display, 36GB Unified Memory.", new BigDecimal("2499.00"), 20, electronics.getId(), "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"),
            new Product("Apple Watch Series 9 GPS", "Advanced health sensors, S9 SiP, Double tap gesture.", new BigDecimal("399.00"), 85, electronics.getId(), "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"),
            new Product("Bose QuietComfort Ultra Earbuds", "Spatial audio, custom acoustic cancellation, 6-hr battery.", new BigDecimal("299.00"), 90, electronics.getId(), "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600"),
            new Product("Dell XPS 13 OLED Laptop", "Intel Core i7 13th Gen, 16GB RAM, 512GB SSD 3.5K OLED touch.", new BigDecimal("1299.00"), 25, electronics.getId(), "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"),
            new Product("Logitech MX Master 3S Wireless Mouse", "8K DPI sensor, quiet click switches, ergonomic thumb rest.", new BigDecimal("99.99"), 140, electronics.getId(), "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600"),
            new Product("Mechanical RGB Gaming Keyboard", "Hot-swappable tactile switches with customizable RGB lighting.", new BigDecimal("79.99"), 110, electronics.getId(), "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"),

            // Home & Furniture (5)
            new Product("Modern Scandinavian Velvet Armchair", "Ergonomic lounge accent chair with gold metal legs.", new BigDecimal("219.00"), 30, homeFurniture.getId(), "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600"),
            new Product("Minimalist Solid Wood Dining Table", "6-seater natural oak wood dining room table.", new BigDecimal("499.00"), 15, homeFurniture.getId(), "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600"),
            new Product("Ergonomic Mesh Executive Office Chair", "Adjustable lumbar support 3D armrests headrest swivel chair.", new BigDecimal("189.00"), 50, homeFurniture.getId(), "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600"),
            new Product("Smart LED Touch Control Desk Lamp", "Dimmable eye-caring LED lamp with wireless phone charger.", new BigDecimal("39.99"), 130, homeFurniture.getId(), "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"),
            new Product("Handwoven Jute Area Rug 5x7 ft", "Natural eco-friendly woven area rug for living room decor.", new BigDecimal("89.00"), 70, homeFurniture.getId(), "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600"),

            // Appliances (4)
            new Product("Smart 4K QLED 65-inch TV", "Quantum Dot technology, 120Hz refresh rate, Dolby Atmos.", new BigDecimal("749.99"), 25, appliances.getId(), "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"),
            new Product("Automatic Espresso Coffee Machine", "15-bar Italian pump espresso maker with steam wand.", new BigDecimal("189.99"), 45, appliances.getId(), "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600"),
            new Product("Dyson V15 Detect Cordless Vacuum", "Laser illumination reveals invisible dust, 60-min runtime.", new BigDecimal("649.00"), 30, appliances.getId(), "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600"),
            new Product("Smart Countertop Air Fryer XL 6QT", "8 one-touch cooking presets, 85% less oil frying.", new BigDecimal("99.50"), 90, appliances.getId(), "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"),

            // Grocery Essentials (3)
            new Product("Organic Extra Virgin Olive Oil 1L", "Cold-pressed unrefined Mediterranean extra virgin olive oil.", new BigDecimal("18.99"), 160, grocery.getId(), "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600"),
            new Product("Premium Roasted Whole Almonds 500g", "Crunchy oven-roasted unsalted California almonds.", new BigDecimal("12.50"), 220, grocery.getId(), "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600"),
            new Product("Gourmet Dark Roast Coffee Beans 1kg", "100% Arabica single-origin dark roast whole coffee beans.", new BigDecimal("24.99"), 140, grocery.getId(), "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600"),

            // Toys, Beauty & More (2)
            new Product("LEGO Star Wars Millennium Falcon", "1,351 piece iconic starship building model kit.", new BigDecimal("169.99"), 40, toysBeauty.getId(), "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600"),
            new Product("Advanced Hydrating Face Serum", "Pure Hyaluronic Acid + Vitamin B5 plump skin hydration.", new BigDecimal("28.00"), 180, toysBeauty.getId(), "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"),

            // Two Wheelers & Gear (2)
            new Product("Foldable High-Speed Electric Scooter 350W", "25mph top speed, 22-mile long range battery foldable scooter.", new BigDecimal("399.00"), 35, twoWheelers.getId(), "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600"),
            new Product("Aerodynamic Full Face Motorcycle Helmet", "DOT approved lightweight ABS shell with anti-fog dual visor.", new BigDecimal("119.00"), 75, twoWheelers.getId(), "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600")
        );

        productRepository.saveAll(products);
        System.out.println("Catalog database successfully seeded with all " + products.size() + " products!");
    }
}
