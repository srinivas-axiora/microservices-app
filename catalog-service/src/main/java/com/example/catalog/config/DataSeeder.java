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

        if (productRepository.count() > 0) {
            System.out.println("Catalog database already seeded. Skipping initial data seeding.");
            return;
        }

        System.out.println("Seeding catalog database with categories and sample products...");

        // 1. Create Categories
        Category electronics = categoryRepository.save(new Category("Electronics", "Gadgets, smartphones, audio, and devices"));
        Category clothing = categoryRepository.save(new Category("Clothing", "Men and Women fashion wear"));
        Category home = categoryRepository.save(new Category("Home & Kitchen", "Home appliances, decor, and kitchenware"));
        Category books = categoryRepository.save(new Category("Books & Stationery", "Bestsellers, novels, and office supplies"));

        // 2. Create Products (18 products across categories)
        List<Product> products = Arrays.asList(
            // Electronics
            new Product("Wireless Noise-Canceling Headphones", "Premium over-ear headphones with active noise cancellation and 30-hour battery life.", new BigDecimal("199.99"), 45, electronics.getId(), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"),
            new Product("Smart OLED Watch Series 7", "Water-resistant smartwatch with heart rate sensor, GPS, and OLED display.", new BigDecimal("249.50"), 30, electronics.getId(), "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"),
            new Product("Ultra Slim Laptop 15 Pro", "Lightweight high-performance laptop featuring 16GB RAM and 512GB SSD.", new BigDecimal("899.00"), 15, electronics.getId(), "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"),
            new Product("4K Ultra HD Action Camera", "Compact waterproof action camera capable of 4K 60fps recording.", new BigDecimal("129.99"), 60, electronics.getId(), "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500"),
            new Product("Portable Bluetooth Speaker", "Rugged outdoor Bluetooth speaker with deep bass and IPX7 rating.", new BigDecimal("59.95"), 100, electronics.getId(), "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"),

            // Clothing
            new Product("Classic Cotton Oxford Shirt", "100% breathable organic cotton button-up casual shirt.", new BigDecimal("39.99"), 120, clothing.getId(), "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500"),
            new Product("Slim Fit Stretch Denim Jeans", "Durable stretch denim jeans with modern slim fit cut.", new BigDecimal("54.90"), 85, clothing.getId(), "https://images.unsplash.com/photo-1542272604-780c36856d67?w=500"),
            new Product("Lightweight Running Sneakers", "Ergonomic mesh running shoes with cushioned foam insoles.", new BigDecimal("79.99"), 90, clothing.getId(), "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"),
            new Product("Windproof Winter Parka Jacket", "Insulated winter jacket with fleece lining and detachable hood.", new BigDecimal("119.00"), 25, clothing.getId(), "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500"),
            new Product("Casual Crewneck Sweatshirt", "Soft fleece crewneck pullover ideal for everyday casual wear.", new BigDecimal("29.99"), 150, clothing.getId(), "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500"),

            // Home & Kitchen
            new Product("Automatic Espresso Coffee Machine", "15-bar Italian pump espresso machine with integrated milk frother.", new BigDecimal("159.99"), 20, home.getId(), "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500"),
            new Product("Smart HEPA Air Purifier", "Filters 99.97% of airborne particles with quiet night mode.", new BigDecimal("89.95"), 40, home.getId(), "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500"),
            new Product("Non-Stick Ceramic Cookware Set", "10-piece non-stick non-toxic ceramic pots and pans set.", new BigDecimal("129.50"), 35, home.getId(), "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500"),
            new Product("Modern Minimalist Desk Lamp", "LED touch-control table lamp with adjustable brightness and USB charger.", new BigDecimal("34.99"), 75, home.getId(), "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"),

            // Books & Stationery
            new Product("Hardcover Architectural Design Guide", "Comprehensive visual guide to modern architectural principles.", new BigDecimal("45.00"), 50, books.getId(), "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"),
            new Product("Premium Leather Notebook", "Refillable genuine leather journal with 200 unruled ivory pages.", new BigDecimal("24.99"), 110, books.getId(), "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500"),
            new Product("Ergonomic Fountain Pen Set", "Fine nib fountain pen with converter and 5 refill ink cartridges.", new BigDecimal("19.99"), 95, books.getId(), "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500")
        );

        productRepository.saveAll(products);
        System.out.println("Catalog seeding completed successfully with " + products.size() + " products.");
    }
}
