import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import authService from '../../../services/authService';

function UserSettings() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [tempForm, setTempForm] = useState({ name: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fetchUserData = async () => {
    try {
      const res = await authService.getProfile();
      setForm(res.data.user || {});
      setTempForm(res.data.user || {});
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch user profile', 'error');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (field, value) => {
    setTempForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Account Settings</h1>
        <p style={styles.subtitle}>Manage your account information and password</p>
      </div>

      <div style={styles.card}>
        {editMode ? (
          <>
            <div style={styles.row}>
              <label>Name:</label>
              <input
                type="text"
                value={tempForm.name}
                onChange={e => handleChange('name', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <label>Email:</label>
              <input
                type="email"
                value={tempForm.email}
                onChange={e => handleChange('email', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={handleSave}>Save</button>
              <button style={styles.button} onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div style={styles.row}><label>Name:</label><span>{form.name}</span></div>
            <div style={styles.row}><label>Email:</label><span>{form.email}</span></div>
            <div style={styles.row}><label>Password:</label><span>********</span></div>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={() => setEditMode(true)}>Edit Info</button>
              <button style={styles.button} onClick={() => setPasswordMode(!passwordMode)}>Change Password</button>
            </div>
          </>
        )}

        {passwordMode && (
          <div style={styles.passwordSection}>
            <h3 style={styles.subheading}>Change Password</h3>
            <div style={styles.row}>
              <label>Current Password:</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={e => handlePasswordChange('currentPassword', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <label>New Password:</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => handlePasswordChange('newPassword', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.buttonGroup}>
              <button style={styles.button} onClick={handlePasswordSubmit}>Update Password</button>
              <button style={styles.button} onClick={() => setPasswordMode(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#48bb78', // ✅ Updated green color
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 0 10px #e0e0e0',
    padding: '25px',
  },
  subheading: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  row: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#faa500',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  passwordSection: {
    marginTop: '20px',
  },
};

export default UserSettings;
