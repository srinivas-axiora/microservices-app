package com.example.catalog.config;

import com.example.catalog.model.Category;
import com.example.catalog.model.Product;
import com.example.catalog.model.User;
import com.example.catalog.repository.CategoryRepository;
import com.example.catalog.repository.ProductRepository;
import com.example.catalog.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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
    public void run(String... args) throws Exception {
        // Seed default admin user if not exists
        if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
            userRepository.save(new User("admin@admin.com", "admin", "Admin User"));
            System.out.println("Default user 'admin@admin.com' seeded successfully.");
        }

        // Clear old products/categories if re-seeding needed or count check
        if (productRepository.count() == 0) {
            System.out.println("Seeding catalog database with Flipkart-style categories and products...");

            // 1. Create Categories (matching Flipkart header nav)
            Category grocery = categoryRepository.save(new Category("Grocery", "Daily essentials, staples and snacks", "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200"));
            Category mobiles = categoryRepository.save(new Category("Mobiles", "Smartphones, accessories and tablets", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200"));
            Category fashion = categoryRepository.save(new Category("Fashion", "Men, women clothing and footwear", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200"));
            Category electronics = categoryRepository.save(new Category("Electronics", "Laptops, audio and smart gadgets", "https://images.unsplash.com/photo-1498049860654-af1a5c566876?w=200"));
            Category homeFurniture = categoryRepository.save(new Category("Home & Furniture", "Home decor, furniture and essentials", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200"));
            Category appliances = categoryRepository.save(new Category("Appliances", "TVs, refrigerators and washing machines", "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=200"));
            Category flights = categoryRepository.save(new Category("Flight Booking", "Domestic & international flight deals", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200"));
            Category toysBeauty = categoryRepository.save(new Category("Toys, Beauty & More", "Toys, cosmetics and personal care", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200"));
            Category twoWheelers = categoryRepository.save(new Category("Two Wheelers", "Electric bikes, scooters and gear", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200"));

            // 2. Create Products
            List<Product> products = Arrays.asList(
                // Mobiles
                new Product("iPhone 15 Pro Max 256GB", "A17 Pro chip, Titanium design, 48MP camera system.", new BigDecimal("1199.00"), 50, mobiles.getId(), "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"),
                new Product("Samsung Galaxy S24 Ultra", "Galaxy AI, 200MP camera, Snapdragon 8 Gen 3.", new BigDecimal("1299.99"), 40, mobiles.getId(), "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"),
                new Product("OnePlus 12 5G Smooth Green", "Snapdragon 8 Gen 3, 100W SuperVOOC fast charging.", new BigDecimal("799.00"), 65, mobiles.getId(), "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"),

                // Fashion Best Sellers
                new Product("Men's Red Lightweight Bomber Jacket", "Water-resistant windbreaker sport jacket with zip front.", new BigDecimal("49.99"), 120, fashion.getId(), "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"),
                new Product("Classic White Street Sneakers", "Trendy white leather urban sneakers with rubber soles.", new BigDecimal("59.99"), 150, fashion.getId(), "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"),
                new Product("Women's Stylish Denim Jacket", "Classic vintage wash denim jacket with buttoned pockets.", new BigDecimal("64.50"), 80, fashion.getId(), "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=600"),
                new Product("Slim Fit Cotton Oxford Shirt", "Breathable organic cotton formal button-down shirt.", new BigDecimal("39.90"), 95, fashion.getId(), "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"),

                // Electronics
                new Product("Sony WH-1000XM5 Wireless Headphones", "Industry leading noise canceling over-ear headphones.", new BigDecimal("348.00"), 75, electronics.getId(), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"),
                new Product("MacBook Pro 16 M3 Max", "16-inch Liquid Retina XDR display, 36GB Unified Memory.", new BigDecimal("2499.00"), 20, electronics.getId(), "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"),
                new Product("Apple Watch Series 9 GPS", "Advanced health sensors, S9 SiP, Double tap gesture.", new BigDecimal("399.00"), 85, electronics.getId(), "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"),

                // Home & Furniture
                new Product("Modern Scandinavian Velvet Armchair", "Ergonomic lounge accent chair with gold metal legs.", new BigDecimal("219.00"), 30, homeFurniture.getId(), "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600"),
                new Product("Minimalist Solid Wood Dining Table", "6-seater natural oak wood dining room table.", new BigDecimal("499.00"), 15, homeFurniture.getId(), "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600"),

                // Appliances
                new Product("Smart 4K QLED 65-inch TV", "Quantum Dot technology, 120Hz refresh rate, Dolby Atmos.", new BigDecimal("749.99"), 25, appliances.getId(), "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"),
                new Product("Automatic Espresso Coffee Machine", "15-bar Italian pump espresso maker with steam wand.", new BigDecimal("189.99"), 45, appliances.getId(), "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600")
            );

            productRepository.saveAll(products);
            System.out.println("Catalog database seeded with " + products.size() + " Flipkart products.");
        }
    }
}

