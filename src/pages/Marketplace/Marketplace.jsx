import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { productService, CATEGORIES } from '../../services/marketplace.service';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import ProductCard from '../../components/ProductCard/ProductCard';
import { ShoppingCart, FilterList, Close, Search } from '@mui/icons-material';
import './Marketplace.scss';

const CATEGORY_OPTIONS = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: CATEGORIES.FOOTWEAR, name: 'Footwear', icon: '👟' },
  { id: CATEGORIES.APPAREL, name: 'Apparel', icon: '👕' },
  { id: CATEGORIES.ACCESSORIES, name: 'Accessories', icon: '🧢' },
  { id: CATEGORIES.EQUIPMENT, name: 'Equipment', icon: '⚽' },
  { id: CATEGORIES.TRAINING, name: 'Training', icon: '💪' },
  { id: CATEGORIES.FAN_GEAR, name: 'Fan Gear', icon: '🏆' }
];

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'salesCount_desc', label: 'Best Selling' },
  { value: 'rating_desc', label: 'Highest Rated' }
];

const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under KSH 1000', min: 0, max: 1000 },
  { label: 'KSH 1000 - 2500', min: 1000, max: 2500 },
  { label: 'KSH 2500 - 5000', min: 2500, max: 5000 },
  { label: 'KSH 5000 - 10000', min: 5000, max: 10000 },
  { label: 'Above KSH 10000', min: 10000, max: Infinity },
];

export default function Marketplace() {
  const { currentUser } = useAuth();
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const categoryScrollRef = useRef(null);

  const fetchProducts = useCallback(async (reset = false) => {
    if (reset) {
      setProducts([]);
      setLastDoc(null);
    }
    
    setLoading(reset);
    setLoadingMore(!reset);
    
    const filters = {};
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    
    const priceRange = PRICE_RANGES[selectedPriceRange];
    if (priceRange && priceRange.min > 0) filters.minPrice = priceRange.min;
    if (priceRange && priceRange.max !== Infinity) filters.maxPrice = priceRange.max;
    
    const [sortField, sortOrder] = sortBy.split('_');
    filters.sortBy = sortField;
    filters.sortOrder = sortOrder;
    
    const result = await productService.getProducts(1, 12, filters, reset ? null : lastDoc);
    
    if (reset) {
      setProducts(result.products);
    } else {
      setProducts(prev => [...prev, ...result.products]);
    }
    setHasMore(result.hasMore);
    setLastDoc(result.lastDoc);
    setLoading(false);
    setLoadingMore(false);
  }, [selectedCategory, sortBy, selectedPriceRange, lastDoc]);

  useEffect(() => {
    fetchProducts(true);
  }, [selectedCategory, sortBy, selectedPriceRange]);

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchProducts(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(true);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleAddToCart = async (product, size, color) => {
    if (!currentUser) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    const result = await addToCart(product.id, 1, size, color);
    if (result.success) {
      alert(`${product.name} added to cart!`);
    } else {
      alert(result.error);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange(0);
    setSortBy('createdAt_desc');
    setSearchQuery('');
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <div className="header-content">
          <h1>⚡ PowerKing Store</h1>
          <p>Premium football gear, apparel, and accessories</p>
        </div>
        <div className="cart-icon" onClick={() => navigate('/cart')}>
          <ShoppingCart />
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </div>
      </div>
      
      <div className="marketplace-filters">
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn"><Search /></button>
          </form>
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FilterList /> Filters
          </button>
        </div>
        
        <div className={`filters-panel ${showFilters ? 'show' : ''}`}>
          <div className="filter-section">
            <label>Categories</label>
            <div className="category-chips" ref={categoryScrollRef}>
              {CATEGORY_OPTIONS.map(cat => (
                <button
                  key={cat.id}
                  className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="chip-icon">{cat.icon}</span>
                  <span className="chip-label">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <label>Price Range</label>
            <div className="price-chips">
              {PRICE_RANGES.map((range, index) => (
                <button
                  key={index}
                  className={`price-chip ${selectedPriceRange === index ? 'active' : ''}`}
                  onClick={() => setSelectedPriceRange(index)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <label>Sort By</label>
            <div className="sort-chips">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`sort-chip ${sortBy === opt.value ? 'active' : ''}`}
                  onClick={() => setSortBy(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          
          <button className="clear-filters" onClick={clearFilters}>
            <Close /> Clear All Filters
          </button>
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="results-info">
            <span>{filteredProducts.length} products found</span>
          </div>
          
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(product, size, color) => handleAddToCart(product, size, color)}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn-clear" onClick={clearFilters}>Clear All Filters</button>
            </div>
          )}
          
          {hasMore && filteredProducts.length > 0 && (
            <div className="load-more">
              <button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More Products'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}