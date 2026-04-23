import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder, ShoppingCart, Visibility } from '@mui/icons-material';
import './ProductCard.scss';

export default function ProductCard({ product, onAddToCart, onAddToWishlist, isWishlisted = false }) {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
  };

  return (
    <div 
      className="product-card" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        {!imageLoaded && <div className="image-skeleton"></div>}
        <img 
          src={product.images?.[0] || '/placeholder.jpg'} 
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
        {product.discount && <span className="discount-badge">-{product.discount}%</span>}
        {!product.inStock && <span className="out-of-stock">Out of Stock</span>}
        {product.isNew && <span className="new-badge">New</span>}
        {product.bestseller && <span className="bestseller-badge">⭐ Bestseller</span>}
        
        <div className={`product-actions ${isHovered ? 'show' : ''}`}>
          <button className="action-btn" onClick={handleQuickView} title="Quick View">
            <Visibility />
          </button>
          <button className="action-btn" onClick={handleAddToWishlist} title="Add to Wishlist">
            {isWishlisted ? <Favorite className="active" /> : <FavoriteBorder />}
          </button>
          <button className="action-btn" onClick={handleAddToCartClick} title="Add to Cart" disabled={!product.inStock}>
            <ShoppingCart />
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
          <span className="category">{product.category}</span>
        </div>
        
        <div className="rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={`star ${star <= (product.rating || 0) ? 'filled' : ''}`}>★</span>
            ))}
          </div>
          <span className="review-count">({product.reviews?.length || 0})</span>
        </div>
        
        <div className="price">
          <span className="current">KSH {product.price?.toLocaleString()}</span>
          {product.oldPrice && <span className="old">KSH {product.oldPrice?.toLocaleString()}</span>}
        </div>
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="size-selector">
            <span className="selector-label">Size:</span>
            <div className="size-options">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {product.colors && product.colors.length > 0 && (
          <div className="color-selector">
            <span className="selector-label">Color:</span>
            <div className="color-options">
              {product.colors.map(color => (
                <button
                  key={color}
                  className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={(e) => { e.stopPropagation(); setSelectedColor(color); }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
        
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCartClick}
          disabled={!product.inStock}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          <ShoppingCart className="btn-icon" />
        </button>
      </div>
    </div>
  );
}