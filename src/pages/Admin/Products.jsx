import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService, CATEGORIES } from '../../services/marketplace.service';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Products.scss';

export default function Products() {
  const { isAdmin, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    oldPrice: '',
    stock: '',
    images: [],
    sizes: [],
    colors: [],
    featured: false,
    inStock: true,
    tags: []
  });
  const [imageUrl, setImageUrl] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    const result = await productService.getProducts(1, 100);
    setProducts(result.products);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    if (sizeInput && !formData.sizes.includes(sizeInput)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput]
      }));
      setSizeInput('');
    }
  };

  const removeSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput]
      }));
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      oldPrice: '',
      stock: '',
      images: [],
      sizes: [],
      colors: [],
      featured: false,
      inStock: true,
      tags: []
    });
    setEditingProduct(null);
    setImageUrl('');
    setSizeInput('');
    setColorInput('');
    setTagInput('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      stock: parseInt(formData.stock),
      inStock: parseInt(formData.stock) > 0,
      createdAt: new Date().toISOString()
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        Swal.fire('Updated!', 'Product updated successfully.', 'success');
      } else {
        await productService.addProduct(productData);
        Swal.fire('Added!', 'Product added successfully.', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      Swal.fire('Error', error.message || 'Something went wrong.', 'error');
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete'
    });
    if (result.isConfirmed) {
      await productService.deleteProduct(id);
      Swal.fire('Deleted!', 'Product deleted.', 'success');
      fetchProducts();
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      stock: product.stock || '',
      images: product.images || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      featured: product.featured || false,
      inStock: product.inStock !== false,
      tags: product.tags || []
    });
    setShowModal(true);
  };

  const categoryOptions = [
    { value: 'footwear', label: 'Footwear', icon: '👟' },
    { value: 'apparel', label: 'Apparel', icon: '👕' },
    { value: 'accessories', label: 'Accessories', icon: '🧢' },
    { value: 'equipment', label: 'Equipment', icon: '⚽' },
    { value: 'training', label: 'Training', icon: '💪' },
    { value: 'fan_gear', label: 'Fan Gear', icon: '🏆' }
  ];

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products Management</h1>
        <button className="btn-add" onClick={() => { resetForm(); setShowModal(true); }}>+ Add Product</button>
      </div>
      
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="product-thumb" /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>KSH {product.price?.toLocaleString()}</td>
                <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock || 0}</td>
                <td><span className={`status-badge ${product.inStock ? 'in-stock' : 'out-stock'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
                <td>
                  <button className="btn-edit" onClick={() => editProduct(product)}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Nike Mercurial Superfly" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    {categoryOptions.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Product description..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (KSH) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Old Price (KSH)</label>
                  <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="0" />
                </div>
              </div>

              <div className="form-group">
                <label>Product Images</label>
                <div className="image-upload">
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Enter image URL" />
                  <button type="button" onClick={addImage}>Add Image</button>
                </div>
                <div className="image-preview">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="preview-item">
                      <img src={img} alt={`Product ${idx + 1}`} />
                      <button className="remove-image" onClick={() => removeImage(idx)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sizes</label>
                  <div className="tag-input">
                    <input type="text" value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="e.g., S, M, L, XL" />
                    <button type="button" onClick={addSize}>Add</button>
                  </div>
                  <div className="tags-list">
                    {formData.sizes.map(size => (
                      <span key={size} className="tag" onClick={() => removeSize(size)}>{size} ×</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Colors</label>
                  <div className="tag-input">
                    <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="e.g., Red, Blue, Black" />
                    <button type="button" onClick={addColor}>Add</button>
                  </div>
                  <div className="tags-list">
                    {formData.colors.map(color => (
                      <span key={color} className="tag color-tag" style={{ backgroundColor: color.toLowerCase() }} onClick={() => removeColor(color)}>{color} ×</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tag-input">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g., bestseller, new, sale" />
                  <button type="button" onClick={addTag}>Add</button>
                </div>
                <div className="tags-list">
                  {formData.tags.map(tag => (
                    <span key={tag} className="tag" onClick={() => removeTag(tag)}>#{tag} ×</span>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} id="featured" />
                  <label htmlFor="featured">Feature this product</label>
                </div>
                <div className="form-group checkbox-group">
                  <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleInputChange} id="inStock" />
                  <label htmlFor="inStock">In Stock</label>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}