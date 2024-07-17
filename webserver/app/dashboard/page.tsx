"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Edit, Zap, Home, Eye } from 'lucide-react';
import Link from 'next/link';

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    trending: false,
    visible: true
  });
  
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        const initialProducts = [
          { name: "IntelliJ IDEA Ultimate", price: 499, description: "The most intelligent Java IDE", image: "intellij.png", trending: true, visible: true },
          { name: "PyCharm Professional", price: 199, description: "Python IDE for Professional Developers", image: "pycharm.png", trending: false, visible: true },
        ];
        setProducts(initialProducts);
        localStorage.setItem('products', JSON.stringify(initialProducts));
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load product data. Please refresh the page.");
    }
  }, []);

  const updateStorage = (updatedProducts) => {
    try {
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      // Here you would also make an API call to update the server-side data
      // For example:
      // fetch('/api/updateProducts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedProducts)
      // });
    } catch (err) {
      console.error("Error updating storage:", err);
      setError("Failed to update product data. Please try again.");
    }
  };

  const handleToggleVisibility = (index) => {
    try {
      const updatedProducts = products.map((product, i) => 
        i === index ? { ...product, visible: !product.visible } : product
      );
      setProducts(updatedProducts);
      updateStorage(updatedProducts);
      setError(null);
    } catch (err) {
      console.error("Error toggling visibility status:", err);
      setError('Error changing visibility status');
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    if (isEditing) {
      setEditingProduct(prev => ({ ...prev, [name]: newValue }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const handleAddProduct = () => {
    try {
      if (newProduct.name && newProduct.price && newProduct.description && newProduct.image) {
        const updatedProducts = [...products, { ...newProduct, price: parseFloat(newProduct.price) }];
        setProducts(updatedProducts);
        updateStorage(updatedProducts);
        setNewProduct({ name: '', price: '', description: '', image: '', trending: false, visible: true });
        setError(null);
      } else {
        throw new Error('Please fill in all fields');
      }
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message);
    }
  };

  const handleDeleteProduct = (index) => {
    try {
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
      updateStorage(updatedProducts);
      setError(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError('Error deleting product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = () => {
    try {
      const updatedProducts = products.map(product => 
        product.name === editingProduct.name ? editingProduct : product
      );
      setProducts(updatedProducts);
      updateStorage(updatedProducts);
      setEditingProduct(null);
      setError(null);
    } catch (err) {
      console.error("Error saving edit:", err);
      setError('Error saving changes');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleToggleTrending = (index) => {
    try {
      const updatedProducts = products.map((product, i) => 
        i === index ? { ...product, trending: !product.trending } : product
      );
      setProducts(updatedProducts);
      updateStorage(updatedProducts);
      setError(null);
    } catch (err) {
      console.error("Error toggling trending status:", err);
      setError('Error changing trending status');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-purple-800">Dashboard</h1>
        <Link href="/">
          <Button variant="outline">
            <Home className="mr-2" size={16} />
            Main Site
          </Button>
        </Link>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center mt-4">
            <Zap className="text-yellow-500 mr-2" size={16} />
            <Switch
              id="trending"
              name="trending"
              checked={newProduct.trending}
              onCheckedChange={(checked) => handleInputChange({ target: { name: 'trending', type: 'checkbox', checked } })}
            />
            <label htmlFor="trending" className="ml-2">Trending Product</label>
          </div>
          {newProduct.image && (
            <div className="mt-4">
              <img 
                src={newProduct.image} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded" 
                onError={(e) => {e.target.src = 'https://placehold.co/500x500.png'; newProduct.image = 'https://placehold.co/500x500.png'}} 
              />
            </div>
          )}
          <Button onClick={handleAddProduct} className="mt-4 w-full">
            <Plus className="mr-2" size={16} />
            Add Product
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.map((product, index) => (
            <div key={index} className="flex justify-between items-center mb-4 pb-4 border-b last:border-b-0">
              {editingProduct && editingProduct.name === product.name ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Product Name"
                      name="name"
                      value={editingProduct.name}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                    <Input
                      placeholder="Price"
                      name="price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                    <Input
                      placeholder="Description"
                      name="description"
                      value={editingProduct.description}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                    <Input
                      placeholder="Image URL"
                      name="image"
                      value={editingProduct.image}
                      onChange={(e) => handleInputChange(e, true)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <Eye className="text-purple-500 mr-2" size={16} />
                    <Switch
                      id="edit-visible"
                      name="visible"
                      checked={editingProduct.visible}
                      onCheckedChange={(checked) => handleInputChange({ target: { name: 'visible', type: 'checkbox', checked } }, true)}
                    />
                    <label htmlFor="edit-visible" className="ml-2">Visible Product</label>
                  </div>
                  <div className="flex items-center mb-4">
                    <Zap className="text-yellow-500 mr-2" size={16} />
                    <Switch
                      id="edit-trending"
                      name="trending"
                      checked={editingProduct.trending}
                      onCheckedChange={(checked) => handleInputChange({ target: { name: 'trending', type: 'checkbox', checked } }, true)}
                    />
                    <label htmlFor="edit-trending" className="ml-2">Trending Product</label>
                  </div>
                  {editingProduct.image && (
                    <div className="mb-4">
                      <img src={editingProduct.image} alt="Preview" className="w-32 h-32 object-cover rounded" />
                    </div>
                  )}
                  <div className="flex justify-end">
                    <Button onClick={handleSaveEdit} className="mr-2">Save</Button>
                    <Button onClick={handleCancelEdit} variant="destructive">Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded mr-4" />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p>${product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Zap className="text-yellow-500 mr-2" size={16} />
                    <Switch
                      id={`trending-${index}`}
                      checked={product.trending}
                      onCheckedChange={() => handleToggleTrending(index)}
                      className="mr-4"
                    />
                    <Eye className="text-purple-500 mr-2" size={16} />
                    <Switch
                      id={`visible-${index}`}
                      checked={product.visible}
                      onCheckedChange={() => handleToggleVisibility(index)}
                      className="mr-4"
                    />
                    <Button variant="outline" onClick={() => handleEditProduct(product)} className="mr-2">
                      <Edit size={16} />
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteProduct(index)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;