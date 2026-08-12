import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getUserId } from '../api';

const CartPage = ({ onCartChange }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [savedForLater, setSavedForLater] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'buyAgain'

  useEffect(() => {
    fetchCartAndProducts();
  }, []);

  const fetchCartAndProducts = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      // Fetch cart and catalog products concurrently
      const [cartRes, productsRes] = await Promise.allSettled([
        api.get(`/cart/${userId}`),
        api.get('/catalog/products')
      ]);

      const fetchedCart = cartRes.status === 'fulfilled' ? cartRes.value.data : null;
      setCart(fetchedCart);

      if (fetchedCart && fetchedCart.items) {
        const initialSelected = {};
        fetchedCart.items.forEach(i => {
          initialSelected[i.productId] = true;
        });
        setSelectedItems(initialSelected);
      }

      if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value.data)) {
        const map = {};
        productsRes.value.data.forEach(p => {
          map[String(p.id)] = p;
        });
        setProductsMap(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return;

    try {
      const userId = getUserId();
      const res = await api.post(`/cart/${userId}/items`, {
        productId,
        quantity: newQty,
        price: item.price
      });
      setCart(res.data);
      if (onCartChange) onCartChange();
    } catch (err) {
      console.error(err);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const userId = getUserId();
      const res = await api.delete(`/cart/${userId}/items/${productId}`);
      setCart(res.data);
      if (onCartChange) onCartChange();
    } catch (err) {
      console.error(err);
      alert('Failed to remove item');
    }
  };

  const handleSaveForLater = (item) => {
    setSavedForLater([...savedForLater, item]);
    handleRemoveItem(item.productId);
  };

  const handleMoveToCart = async (item) => {
    try {
      const userId = getUserId();
      const res = await api.post(`/cart/${userId}/items`, {
        productId: item.productId,
        quantity: item.quantity || 1,
        price: item.price
      });
      setCart(res.data);
      setSavedForLater(savedForLater.filter(i => i.productId !== item.productId));
      if (onCartChange) onCartChange();
    } catch (err) {
      console.error(err);
      alert('Failed to move item to cart');
    }
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const toggleSelectAll = () => {
    const items = cart?.items || [];
    const allSelected = items.every(i => selectedItems[i.productId]);
    const nextState = {};
    items.forEach(i => {
      nextState[i.productId] = !allSelected;
    });
    setSelectedItems(nextState);
  };

  const getSelectedCountAndTotal = () => {
    const items = cart?.items || [];
    let count = 0;
    let total = 0;
    items.forEach(item => {
      if (selectedItems[item.productId]) {
        count += item.quantity;
        total += item.price * item.quantity;
      }
    });
    return { count, total };
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Amazon-style Cart...</div>;

  const items = cart?.items || [];
  const { count: selectedCount, total: selectedTotal } = getSelectedCountAndTotal();
  const allSelected = items.length > 0 && items.every(i => selectedItems[i.productId]);

  // Recommended products list for "Your Items" section
  const recommendedList = Object.values(productsMap);

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '1rem 0.5rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem' }}>
        
        {/* LEFT COLUMN: Shopping Cart Main */}
        <div>
          {/* Main Cart Box */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid #ddd', pb: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '400', color: '#0F1111', margin: 0 }}>Shopping Cart</h1>
                {items.length > 0 && (
                  <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '0.85rem', padding: '0.25rem 0' }}>
                    {allSelected ? 'Deselect all items' : 'Select all items'}
                  </button>
                )}
              </div>
              <span style={{ fontSize: '0.9rem', color: '#565959' }}>Price</span>
            </div>

            {items.length === 0 ? (
              <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Your Shopping Cart is empty</h2>
                <p style={{ color: '#565959', marginBottom: '1rem' }}>Check your Saved for Later items or explore recommended products below.</p>
                <Link to="/" style={{ background: '#FFD814', border: '1px solid #FCD200', padding: '0.5rem 1.5rem', borderRadius: '20px', color: '#0F1111', textDecoration: 'none', fontWeight: '500' }}>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div>
                {items.map((item) => {
                  const productDetails = productsMap[String(item.productId)] || {};
                  const title = productDetails.name || `Product #${item.productId}`;
                  const image = productDetails.imageUrl || 'https://via.placeholder.com/150';
                  const description = productDetails.description || 'In Stock';
                  
                  return (
                    <div key={item.productId} style={{ display: 'grid', gridTemplateColumns: '24px 120px 1fr 100px', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #DDD' }}>
                      {/* Checkbox */}
                      <div style={{ paddingTop: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={!!selectedItems[item.productId]}
                          onChange={() => toggleSelectItem(item.productId)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                      </div>

                      {/* Image */}
                      <div>
                        <img src={image} alt={title} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
                      </div>

                      {/* Info & Controls */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: '500', color: '#0F1111', lineHeight: '1.3', marginBottom: '0.25rem' }}>
                          {title}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#007600', margin: '0.25rem 0' }}>In stock</p>
                        <p style={{ fontSize: '0.8rem', color: '#565959', margin: '0.25rem 0' }}>Eligible for FREE Shipping</p>
                        <p style={{ fontSize: '0.8rem', color: '#565959', margin: '0.25rem 0' }}>{description}</p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                          {/* Quantity Selector */}
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D5D9D9', borderRadius: '8px', background: '#F0F2F2', boxShadow: '0 2px 5px rgba(15,17,17,.15)' }}>
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)} style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                            <span style={{ padding: '0 0.5rem', fontWeight: '600' }}>{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)} style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                          </div>

                          <span style={{ color: '#DDD' }}>|</span>

                          <button onClick={() => handleRemoveItem(item.productId)} style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer' }}>
                            Delete
                          </button>

                          <span style={{ color: '#DDD' }}>|</span>

                          <button onClick={() => handleSaveForLater(item)} style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer' }}>
                            Save for later
                          </button>

                          <span style={{ color: '#DDD' }}>|</span>

                          <button style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer' }}>
                            Share
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0F1111' }}>
                          ${Number(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Subtotal */}
            {items.length > 0 && (
              <div style={{ textAlign: 'right', padding: '1rem 0 0 0', fontSize: '1.15rem', color: '#0F1111' }}>
                Subtotal ({selectedCount} items): <span style={{ fontWeight: '700' }}>${selectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>

          {/* Bottom Tabbed Box: "Your Items" (Saved for Later / Buy It Again) */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#0F1111' }}>Your Items</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
              <button
                onClick={() => setActiveTab('saved')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === 'saved' ? '3px solid #E47911' : 'none',
                  fontWeight: activeTab === 'saved' ? '700' : '400',
                  color: activeTab === 'saved' ? '#0F1111' : '#007185',
                  cursor: 'pointer'
                }}
              >
                Saved for later ({savedForLater.length})
              </button>
              <button
                onClick={() => setActiveTab('buyAgain')}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === 'buyAgain' ? '3px solid #E47911' : 'none',
                  fontWeight: activeTab === 'buyAgain' ? '700' : '400',
                  color: activeTab === 'buyAgain' ? '#0F1111' : '#007185',
                  cursor: 'pointer'
                }}
              >
                Buy it again ({recommendedList.length})
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'saved' ? (
              savedForLater.length === 0 ? (
                <p style={{ color: '#565959', fontSize: '0.9rem', padding: '1rem 0' }}>No items saved for later.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {savedForLater.map(item => {
                    const productDetails = productsMap[String(item.productId)] || {};
                    return (
                      <div key={item.productId} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                        <img src={productDetails.imageUrl || 'https://via.placeholder.com/150'} alt="" style={{ height: '140px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                        <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0F1111', height: '2.4em', overflow: 'hidden' }}>{productDetails.name || `Product #${item.productId}`}</h4>
                        <div style={{ fontWeight: '700', margin: '0.5rem 0', color: '#B12704' }}>${item.price}</div>
                        <button onClick={() => handleMoveToCart(item)} style={{ background: '#FFF', border: '1px solid #D5D9D9', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                          Move to cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {recommendedList.slice(0, 4).map(product => (
                  <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                    <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt="" style={{ height: '140px', objectFit: 'contain', marginBottom: '0.5rem' }} />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#0F1111', height: '2.4em', overflow: 'hidden' }}>{product.name}</h4>
                    <div style={{ fontWeight: '700', margin: '0.5rem 0', color: '#B12704' }}>${product.price}</div>
                    <button
                      onClick={() => handleMoveToCart({ productId: String(product.id), price: Number(product.price) })}
                      style={{ background: '#FFD814', border: '1px solid #FCD200', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Checkout Widget */}
        <div>
          {/* Subtotal Box */}
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#007600', background: '#ecfdf5', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.75rem', border: '1px solid #a7f3d0' }}>
              Your order is eligible for <b>FREE Delivery</b>.
            </div>

            <div style={{ fontSize: '1.15rem', color: '#0F1111', marginBottom: '0.75rem' }}>
              Subtotal ({selectedCount} items): <br/>
              <span style={{ fontSize: '1.3rem', fontWeight: '700' }}>${selectedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0F1111', marginBottom: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" /> This order contains a gift
            </label>

            <button
              onClick={() => navigate('/checkout')}
              disabled={selectedCount === 0}
              style={{
                width: '100%',
                background: selectedCount > 0 ? '#FFD814' : '#F7FAFA',
                borderColor: selectedCount > 0 ? '#FCD200' : '#D5D9D9',
                borderStyle: 'solid',
                borderWidth: '1px',
                padding: '0.6rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#0F1111',
                cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                boxShadow: '0 2px 5px rgba(213,217,217,.5)'
              }}
            >
              Proceed to buy
            </button>
          </div>

          {/* Buy It Again Sidebar Widget */}
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F1111', marginBottom: '0.75rem' }}>Buy it again</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendedList.slice(0, 2).map(item => (
                <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt="" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                  <div>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: '500', color: '#0F1111', maxHeight: '2.4em', overflow: 'hidden' }}>{item.name}</h5>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#B12704' }}>${item.price}</div>
                    <button
                      onClick={() => handleMoveToCart({ productId: String(item.id), price: Number(item.price) })}
                      style={{ background: '#FFD814', border: '1px solid #FCD200', borderRadius: '12px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.25rem' }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;

