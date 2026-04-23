import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/marketplace.service';
import Loader from '../../components/Loader/Loader';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, 
  CreditCard, Smartphone, Truck, ShieldCheck, 
  ChevronRight, CheckCircle, AlertCircle
} from 'lucide-react';
import './Cart.scss';

export default function Cart() {
  const { currentUser } = useAuth();
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingDetails.fullName) newErrors.fullName = 'Full name is required';
    if (!shippingDetails.address) newErrors.address = 'Address is required';
    if (!shippingDetails.city) newErrors.city = 'City is required';
    if (!shippingDetails.phone) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateQuantityHandler = (productId, newQuantity, size, color) => {
    if (newQuantity < 1) {
      removeItem(productId, size, color);
    } else {
      updateQuantity(productId, newQuantity, size, color);
    }
  };

  const handleCheckout = async () => {
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (!validateShipping()) return;
      setCheckoutStep(3);
    } else if (checkoutStep === 3) {
      setProcessing(true);
      const result = await orderService.createOrder(
        currentUser.uid,
        cart,
        shippingDetails,
        paymentMethod
      );
      
      if (result.success) {
        await clearCart();
        navigate(`/order-confirmation/${result.orderId}`);
      } else {
        alert('Failed to place order: ' + result.error);
      }
      setProcessing(false);
    }
  };

  const getDeliveryEstimate = () => {
    const days = Math.floor(Math.random() * 5) + 3;
    return `${days}-${days + 2} business days`;
  };

  if (loading) return <Loader />;

  if (cart.items?.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any items yet.</p>
        <button className="btn-primary" onClick={() => navigate('/marketplace')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const subtotal = cart.total;
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Shopping Cart</h1>
        <div className="cart-steps">
          <div className={`step ${checkoutStep >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">Cart</span>
          </div>
          <div className={`step-line ${checkoutStep >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${checkoutStep >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className={`step-line ${checkoutStep >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${checkoutStep >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      </div>
      
      {checkoutStep === 1 && (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>
            {cart.items.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="product-info">
                  <img src={item.image} alt={item.name} />
                  <div className="product-details">
                    <h4>{item.name}</h4>
                    {item.size && <span className="variant">Size: {item.size}</span>}
                    {item.color && <span className="variant">Color: {item.color}</span>}
                  </div>
                </div>
                <div className="product-price">KSH {item.price.toLocaleString()}</div>
                <div className="quantity-control">
                  <button onClick={() => updateQuantityHandler(item.productId, item.quantity - 1, item.size, item.color)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantityHandler(item.productId, item.quantity + 1, item.size, item.color)}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className="product-total">KSH {(item.price * item.quantity).toLocaleString()}</div>
                <button className="remove-btn" onClick={() => removeItem(item.productId, item.size, item.color)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cart.items.length} items)</span>
              <span>KSH {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `KSH ${shipping.toLocaleString()}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>KSH {total.toLocaleString()}</span>
            </div>
            {shipping === 0 && (
              <div className="free-shipping-badge">
                <Truck size={16} /> You've qualified for free shipping!
              </div>
            )}
            <button className="checkout-btn" onClick={() => setCheckoutStep(2)}>
              Proceed to Checkout <ChevronRight size={18} />
            </button>
            <button className="continue-btn" onClick={() => navigate('/marketplace')}>
              Continue Shopping
            </button>
            <div className="secure-checkout">
              <ShieldCheck size={16} />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      )}
      
      {checkoutStep === 2 && (
        <div className="shipping-form">
          <h2>Shipping Information</h2>
          <div className="form-container">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={shippingDetails.fullName}
                onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})}
                className={errors.fullName ? 'error' : ''}
                placeholder="John Doe"
              />
              {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea
                value={shippingDetails.address}
                onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                className={errors.address ? 'error' : ''}
                placeholder="Street address, building, apartment"
                rows="3"
              />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                  className={errors.city ? 'error' : ''}
                  placeholder="Nairobi"
                />
                {errors.city && <span className="error-msg">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})}
                  className={errors.phone ? 'error' : ''}
                  placeholder="0712345678"
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                value={shippingDetails.email}
                onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                placeholder="john@example.com"
              />
            </div>
            <div className="delivery-info">
              <Truck size={18} />
              <span>Estimated delivery: {getDeliveryEstimate()}</span>
            </div>
            <div className="form-actions">
              <button className="back-btn" onClick={() => setCheckoutStep(1)}>
                Back to Cart
              </button>
              <button className="continue-btn" onClick={handleCheckout}>
                Continue to Payment <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {checkoutStep === 3 && (
        <div className="payment-section">
          <h2>Payment Method</h2>
          <div className="payment-methods">
            <label className={`payment-option ${paymentMethod === 'mpesa' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-icon"><Smartphone size={24} /></div>
              <div className="payment-info">
                <strong>M-Pesa</strong>
                <span>Pay using mobile money</span>
              </div>
              <CheckCircle size={20} className="check-icon" />
            </label>
            <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-icon"><CreditCard size={24} /></div>
              <div className="payment-info">
                <strong>Credit/Debit Card</strong>
                <span>Visa, Mastercard, American Express</span>
              </div>
              <CheckCircle size={20} className="check-icon" />
            </label>
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>KSH {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `KSH ${shipping.toLocaleString()}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>KSH {total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="back-btn" onClick={() => setCheckoutStep(2)}>
              Back to Shipping
            </button>
            <button className="place-order-btn" onClick={handleCheckout} disabled={processing}>
              {processing ? 'Processing...' : `Place Order • KSH ${total.toLocaleString()}`}
            </button>
          </div>
          
          <div className="secure-note">
            <ShieldCheck size={16} />
            <span>Your payment information is encrypted and secure.</span>
          </div>
        </div>
      )}
    </div>
  );
}