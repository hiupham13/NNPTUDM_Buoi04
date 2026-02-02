var express = require('express');
var router = express.Router();

// Mock data - in real app, this would come from database
let products = [
  { 
    id: 3, 
    title: "Classic Heather Gray Hoodie", 
    slug: "classic-heather-gray-hoodie", 
    price: 69, 
    description: "Stay cozy and stylish with our Classic Heather Gray Hoodie.",
    category: { id: 1, name: "Clothes", slug: "clothes" }
  },
  { 
    id: 6, 
    title: "Classic Comfort Fit Joggers", 
    slug: "classic-comfort-fit-joggers", 
    price: 25, 
    description: "Discover the perfect blend of style and comfort.",
    category: { id: 1, name: "Clothes", slug: "clothes" }
  },
  { 
    id: 18, 
    title: "Sleek White & Orange Wireless Gaming Controller", 
    slug: "sleek-white-orange-wireless-gaming-controller", 
    price: 69, 
    description: "Elevate your gaming experience with this state-of-the-art wireless controller.",
    category: { id: 2, name: "Electronics", slug: "electronics" }
  },
  { 
    id: 22, 
    title: "Sleek Wireless Computer Mouse", 
    slug: "sleek-wireless-computer-mouse", 
    price: 10, 
    description: "Experience smooth and precise navigation with this modern wireless mouse.",
    category: { id: 2, name: "Electronics", slug: "electronics" }
  },
  { 
    id: 28, 
    title: "Sleek Modern Leather Sofa", 
    slug: "sleek-modern-leather-sofa", 
    price: 53, 
    description: "Enhance the elegance of your living space.",
    category: { id: 3, name: "Furniture", slug: "furniture" }
  },
  { 
    id: 35, 
    title: "Futuristic Holographic Soccer Cleats", 
    slug: "futuristic-holographic-soccer-cleats", 
    price: 39, 
    description: "Step onto the field and stand out from the crowd.",
    category: { id: 4, name: "Shoes", slug: "shoes" }
  },
  { 
    id: 45, 
    title: "Sleek Futuristic Electric Bicycle", 
    slug: "sleek-futuristic-electric-bicycle", 
    price: 22, 
    description: "This modern electric bicycle combines style and efficiency.",
    category: { id: 5, name: "Miscellaneous", slug: "miscellaneous" }
  }
];

/**
 * GET /api/v1/products
 * Query parameters:
 * - title (string): Search products by title (case-insensitive includes)
 * - minPrice (number): Filter products with price >= minPrice
 * - maxPrice (number): Filter products with price <= maxPrice
 * - slug (string): Filter products by exact slug match
 */
router.get('/', function(req, res, next) {
  try {
    let filteredProducts = [...products];

    // Filter by title (includes - case insensitive)
    if (req.query.title) {
      const titleSearch = req.query.title.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(titleSearch)
      );
    }

    // Filter by minPrice
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      if (!isNaN(minPrice)) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= minPrice
        );
      }
    }

    // Filter by maxPrice
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      if (!isNaN(maxPrice)) {
        filteredProducts = filteredProducts.filter(product => 
          product.price <= maxPrice
        );
      }
    }

    // Filter by slug (exact match)
    if (req.query.slug) {
      filteredProducts = filteredProducts.filter(product => 
        product.slug === req.query.slug
      );
    }

    res.json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * GET /api/v1/products/:id
 * Get a single product by ID
 */
router.get('/:id', function(req, res, next) {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
