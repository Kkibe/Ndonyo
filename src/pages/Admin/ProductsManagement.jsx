import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/marketplace.service';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProductsManagement.scss';

export default function ProductsManagement() {
  const { isAdmin, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const result = await productService.getProducts(1, 100);
      setProducts(result.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const deleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#00ae58',
      confirmButtonText: 'Yes, delete',
    });
    
    if (result.isConfirmed) {
      try {
        await productService.deleteProduct(productId);
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete product.', 'error');
      }
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="products-management">
      <div className="page-header">
        <h1>Products Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Product</button>
      </div>
      
      {loadingProducts ? (
        <div className="loader">Loading products...</div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
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
                    <button className="btn-edit" onClick={() => setEditingProduct(product)}>Edit</button>
                    <button className="btn-delete" onClick={() => deleteProduct(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}