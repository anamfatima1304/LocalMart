import React from 'react';
import { Heart, Search, Filter, Star, MapPin } from 'lucide-react';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import '../buyer.css'

function BuyerSettings() {
  const [form, setForm] = useState({
    username: 'ahmed_123',
    email: 'ahmed@example.com',
    password: 'password123',
    street: 'House 12, Main Road',
    city: 'Islamabad',
    postalCode: '44000',
    country: 'Pakistan'
  });

  const [editMode, setEditMode] = useState(false);
  const [tempForm, setTempForm] = useState({ ...form });

  const handleChange = (field, value) => {
    setTempForm(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = () => {
    const requiredFields = ['username', 'email', 'password', 'street', 'city', 'postalCode', 'country'];

    for (let field of requiredFields) {
      if (!tempForm[field].trim()) {
        return alert(`Please fill out the ${field} field.`);
      }
    }

    if (!validateEmail(tempForm.email)) {
      return alert('Invalid email format.');
    }

    if (tempForm.password.length < 6) {
      return alert('Password must be at least 6 characters.');
    }

    setForm(tempForm);
    setEditMode(false);
    alert('Account settings updated successfully!');
  };

  return (
    <div className="buyer-settings-page">
      <h1 className="buyer-settings-main-heading">Settings</h1>

      <div className="buyer-settings buyer-card">
        <h2>Account Information</h2>

        {editMode ? (
          <>
            <div className="buyer-settings-row">
              <label>Username:</label>
              <input
                type="text"
                value={tempForm.username}
                onChange={e => handleChange('username', e.target.value)}
              />
            </div>
            <div className="buyer-settings-row">
              <label>Email:</label>
              <input
                type="email"
                value={tempForm.email}
                onChange={e => handleChange('email', e.target.value)}
              />
            </div>
            <div className="buyer-settings-row">
              <label>Password:</label>
              <input
                type="password"
                value={tempForm.password}
                onChange={e => handleChange('password', e.target.value)}
              />
            </div>

            <h3>Address</h3>
            <div className="buyer-settings-row">
              <label>Street:</label>
              <input
                type="text"
                value={tempForm.street}
                onChange={e => handleChange('street', e.target.value)}
              />
            </div>
            <div className="buyer-settings-row">
              <label>City:</label>
              <input
                type="text"
                value={tempForm.city}
                onChange={e => handleChange('city', e.target.value)}
              />
            </div>
            <div className="buyer-settings-row">
              <label>Postal Code:</label>
              <input
                type="text"
                value={tempForm.postalCode}
                onChange={e => handleChange('postalCode', e.target.value)}
              />
            </div>
            <div className="buyer-settings-row">
              <label>Country:</label>
              <input
                type="text"
                value={tempForm.country}
                onChange={e => handleChange('country', e.target.value)}
              />
            </div>

            <div className="buyer-action-buttons">
              <button className="buyer-btn-save" onClick={handleSave}>Save</button>
              <button className="buyer-btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="buyer-settings-row"><label>Username:</label><span>{form.username}</span></div>
            <div className="buyer-settings-row"><label>Email:</label><span>{form.email}</span></div>
            <div className="buyer-settings-row"><label>Password:</label><span>{"*".repeat(form.password.length)}</span></div>
            <h3>Address</h3>
            <div className="buyer-settings-row"><label>Street:</label><span>{form.street}</span></div>
            <div className="buyer-settings-row"><label>City:</label><span>{form.city}</span></div>
            <div className="buyer-settings-row"><label>Postal Code:</label><span>{form.postalCode}</span></div>
            <div className="buyer-settings-row"><label>Country:</label><span>{form.country}</span></div>

            <button className="buyer-btn-edit" onClick={() => setEditMode(true)}>Edit Info</button>
          </>
        )}
      </div>
    </div>
  );
}






export default BuyerSettings;