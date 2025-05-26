import React, { useState } from "react";
import './Settings.css';

function Settings() {

     

    return (
        <div id="settings">
      <div className="header">
        <h1>Settings</h1>
        <p>Manage your shop preferences and account settings</p>
      </div>

      <div className="settings-card">
        <h3>Shop Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="shopName">Shop Name:</label>
            <input
              type="text"
              id="shopName"
              defaultValue="Green Garden Restaurant"
            />
          </div>
          <div className="form-group">
            <label htmlFor="shopPhone">Contact Number:</label>
            <input type="text" id="shopPhone" defaultValue="+92 321 1234567" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="shopAddress">Address:</label>
          <textarea
            id="shopAddress"
            rows="2"
            defaultValue="Shop #12, Food Street, F-10 Markaz, Islamabad"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="shopDescription">Description:</label>
          <textarea
            id="shopDescription"
            rows="3"
            defaultValue="We serve authentic Pakistani cuisine with a modern twist. From biryanis to karahi, our menu has something for everyone."
          ></textarea>
        </div>
        <button className="btn">Save Changes</button>
      </div>

      <div className="settings-card">
        <h3>Delivery Settings</h3>
        <div className="form-group">
          <label htmlFor="deliveryRadius">Delivery Radius (km):</label>
          <input type="number" id="deliveryRadius" defaultValue="10" />
        </div>
        <div className="form-group">
          <label htmlFor="deliveryFee">Delivery Fee (Rs):</label>
          <input type="number" id="deliveryFee" defaultValue="100" />
        </div>
        <div className="form-group">
          <label htmlFor="minOrderValue">Minimum Order Value (Rs):</label>
          <input type="number" id="minOrderValue" defaultValue="300" />
        </div>
        <div className="form-group">
          <label htmlFor="freeDelivery">Free Delivery on Orders Above:</label>
          <input type="number" id="freeDelivery" defaultValue="1000" />
        </div>
        <div className="form-group">
          <div style={{ display: "flex", alignItems: "center" }}>
            <label className="toggle-switch">
              <input type="checkbox" id="deliveryStatus" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span style={{ marginLeft: "10px", color: "var(--gray)" }}>
              Delivery Service Active
            </span>
          </div>
        </div>
        <button className="btn">Save Delivery Settings</button>
      </div>

      <div className="settings-card">
        <h3>Working Hours</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Day
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Open Time
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Close Time
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { day: "Monday", open: "10:00", close: "22:00" },
              { day: "Tuesday", open: "10:00", close: "22:00" },
              { day: "Wednesday", open: "10:00", close: "22:00" },
              { day: "Thursday", open: "10:00", close: "22:00" },
              { day: "Friday", open: "10:00", close: "23:00" },
              { day: "Saturday", open: "11:00", close: "23:00" },
              { day: "Sunday", open: "11:00", close: "22:00" },
            ].map((schedule) => (
              <tr key={schedule.day}>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {schedule.day}
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <input
                    type="time"
                    defaultValue={schedule.open}
                    style={{ width: "120px" }}
                  />
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <input
                    type="time"
                    defaultValue={schedule.close}
                    style={{ width: "120px" }}
                  />
                </td>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <label
                    className="toggle-switch"
                    style={{ transform: "scale(0.8)" }}
                  >
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn" style={{ marginTop: "15px" }}>
          Save Working Hours
        </button>
      </div>

      <div className="settings-card">
        <h3>Account Settings</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="accountEmail">Email Address:</label>
            <input
              type="email"
              id="accountEmail"
              defaultValue="contact@greengardenrestaurant.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountPhone">Phone Number:</label>
            <input
              type="text"
              id="accountPhone"
              defaultValue="+92 321 1234567"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="accountPassword">Change Password:</label>
          <input
            type="password"
            id="accountPassword"
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="accountConfirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="accountConfirmPassword"
            placeholder="Confirm new password"
          />
        </div>
        <button className="btn">Update Account</button>
      </div>
    </div>
);
}

export default Settings;