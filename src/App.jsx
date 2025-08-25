import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Assuming you save styles in a separate CSS file

function ProductList() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null });
  const [editingProduct, setEditingProduct] = useState(null);

  // Function to fetch products using Axios (default)
  const fetchProductsWithAxios = async () => {
    try {
      const response = await axios.get('https://backendpanishop.vercel.app/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Use effect to load products when the component mounts
  useEffect(() => {
    // You can switch to fetchProductsWithFetch if you prefer Fetch API
    fetchProductsWithAxios();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleFileChange = (e, isEditing = false) => {
    if (isEditing) {
      setEditingProduct({ ...editingProduct, image: e.target.files[0] });
    } else {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    }
  };

  const createProduct = async () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    try {
      const response = await axios.post('https://backendpanishop.vercel.app/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', description: '', image: null });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const editProduct = async (productId) => {
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('price', editingProduct.price);
    formData.append('description', editingProduct.description);
    if (editingProduct.image) {
      formData.append('image', editingProduct.image);
    }

    try {
      const response = await axios.put(`https://backendpanishop.vercel.app/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProducts(products.map((product) => (product._id === productId ? response.data : product)));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`https://backendpanishop.vercel.app/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="product-list-container">
      <div className="new-product-form">
        <h2>Add New Product</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
        />
        <input type="file" value={newProduct.image} onChange={handleFileChange} />
        <button className="add-btn" onClick={createProduct}>Add Product</button>
      </div>
      <h1>Products</h1>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product._id} className="product-item">
            {editingProduct && editingProduct._id === product._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Name"
                />
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Price"
                />
                <input
                  type="text"
                  name="description"
                  value={editingProduct.description}
                  onChange={(e) => handleInputChange(e, true)}
                  placeholder="Description"
                />
                <input type="file" onChange={(e) => handleFileChange(e, true)} />
                <button className="save-btn" onClick={() => editProduct(product._id)}>Save</button>
                <button className="cancel-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            ) : (
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>{product.description}</p>
                {product.image && (
                  <img
                    src={`https://backendpanishop.vercel.app/products/${product._id}/image`}
                    alt={product.name}
                    className="product-image"
                  />
                )}
                <button className="edit-btn" onClick={() => setEditingProduct(product)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteProduct(product._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
