import React from 'react';
import { Heart, Search, Filter, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

function FavoriteSection() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Chicken Karahi',
      description: 'Traditional spicy tomato-based curry cooked in a wok.',
      price: 850,
      image: 'https://via.placeholder.com/100?text=Karahi',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Beef Biryani',
      description: 'Aromatic basmati rice layered with spiced beef.',
      price: 750,
      image: 'https://via.placeholder.com/100?text=Biryani',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Mango Lassi',
      description: 'Chilled sweet yogurt drink blended with mango pulp.',
      price: 220,
      image: 'https://via.placeholder.com/100?text=Lassi',
      rating: 4.3
    }
  ]);

  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    rating: ''
  });

  const handleAddFavorite = () => {
    if (!newDish.name || !newDish.price) return alert('Name and price are required');
    setFavorites(prev => [
      ...prev,
      {
        ...newDish,
        id: Date.now(),
        price: parseFloat(newDish.price),
        rating: parseFloat(newDish.rating || 0)
      }
    ]);
    setNewDish({ name: '', description: '', price: '', image: '', rating: '' });
  };

  const handleRemove = id => {
    setFavorites(prev => prev.filter(d => d.id !== id));
  };

  const renderStars = rating => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  };

  return (
    <div className="buyer-favorite-section-wrapper">
      <h1 className="buyer-section-heading">Favorite Dishes</h1>

      <div className="buyer-card favorite-section">
        {favorites.map(dish => (
          <div className="buyer-dish" key={dish.id}>
            <img src={dish.image} alt={dish.name} className="buyer-dish-image" />
            <div className="buyer-dish-info">
              <strong>{dish.name}</strong>
              <p>{dish.description}</p>
              <div className="buyer-stars">{renderStars(dish.rating)} ({dish.rating})</div>
            </div>
            <div className="buyer-dish-meta">
              <div className="buyer-dish-price">Rs. {dish.price}</div>
              <button className="buyer-remove-btn" onClick={() => handleRemove(dish.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default FavoriteSection;