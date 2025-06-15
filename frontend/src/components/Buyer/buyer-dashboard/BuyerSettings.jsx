import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import authService from '../../../services/authService';
import '../buyer.css';

function BuyerSettings() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [tempForm, setTempForm] = useState({ name: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  

  const handleChange = (field, value) => {
    setTempForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const fetchUserData = async () => {
    try {
      const res = await authService.getProfile();
      setForm(res.data.user || {});
      setTempForm(res.data.user || {});
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch user profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!tempForm.name.trim() || !tempForm.email.trim()) {
      return Swal.fire('Validation Error', 'Name and email are required.', 'warning');
    }

    if (!validateEmail(tempForm.email)) {
      return Swal.fire('Validation Error', 'Invalid email format.', 'warning');
    }

    try {
      const res = await authService.updateProfile({
        name: tempForm.name,
        email: tempForm.email,
      });
      setForm(res.data.user);
      setTempForm(res.data.user);
      setEditMode(false);

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your account information was updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });

      window.location.reload();
    } catch (err) {
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return Swal.fire('Validation Error', 'All password fields are required.', 'warning');
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire('Mismatch', 'New password and confirmation do not match.', 'warning');
    }

    try {
      await authService.changePassword({ currentPassword, newPassword });

      await Swal.fire({
        icon: 'success',
        title: 'Password Changed!',
        text: 'Your password has been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMode(false);
    } catch (err) {
      Swal.fire('Error', err.message || 'Password change failed.', 'error');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="buyer-settings-page">
      <h1 className="buyer-settings-main-heading">Settings</h1>

      <div className="buyer-settings buyer-card">
        <h2>Account Information</h2>

        {editMode ? (
          <>
            <div className="buyer-settings-row">
              <label>Name:</label>
              <input
                type="text"
                value={tempForm.name}
                onChange={e => handleChange('name', e.target.value)}
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

            <div className="buyer-action-buttons">
              <button className="buyer-btn-save" onClick={handleSave}>Save</button>
              <button className="buyer-btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="buyer-settings-row"><label>Name:</label><span>{form.name}</span></div>
            <div className="buyer-settings-row"><label>Email:</label><span>{form.email}</span></div>
            <div className="buyer-settings-row"><label>Password:</label><span>********</span></div>

           <button
  className="buyer-btn-edit"
  onClick={() => setEditMode(true)}
  style={{ marginRight: "10px" }}
>
  Edit Info
</button>
<button
  className="buyer-btn-edit"
  onClick={() => setPasswordMode(!passwordMode)}
>
  Change Password
</button>

          </>
        )}

        {passwordMode && (
          <div className="buyer-settings-password-section">
            <h3>Change Password</h3>

            <div className="buyer-settings-row">
              <label>Current Password:</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={e => handlePasswordChange('currentPassword', e.target.value)}
              />
            </div>

            <div className="buyer-settings-row">
              <label>New Password:</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => handlePasswordChange('newPassword', e.target.value)}
              />
            </div>

            <div className="buyer-settings-row">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
              />
            </div>

            <div className="buyer-action-buttons">
              <button className="buyer-btn-save" onClick={handlePasswordSubmit}>Update Password</button>
              <button className="buyer-btn-cancel" onClick={() => setPasswordMode(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerSettings;
