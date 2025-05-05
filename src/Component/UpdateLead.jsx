import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./UpdateLead.css";

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

const UpdateLead = () => {
  const [status, setStatus] = useState("");
  const [leadId, setLeadId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [masterStatus, setMasterStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({ user_id: null, user_name: "" });
  const [userList, setUserList] = useState([]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferUserId, setTransferUserId] = useState("");
  const [transferError, setTransferError] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/all');
      setUserList(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUserList([]);
    }
  };

  const handleCheckStatus = async () => {
    if (!leadId) {
      setError("Please enter a Lead ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("Making request with lead_id:", leadId);
      const response = await api.get('/api/leads/getLeadStatusByLeadId', {
        params: {
          lead_id: leadId
        }
      });
      console.log("Response received:", response.data);
      setStatus(response.data.leadStatus.status_name);
      setRemarks(response.data.lead.remark || "");
      setMasterStatus(response.data.masterStatus);
      const userData = response.data.userData || { user_id: null, user_name: "" };
      setUserData(userData);
      fetchUsers();
    } catch (err) {
      console.error("Error occurred:", err);
      console.error("Error response:", err.response);
      if (err.response?.status === 0) {
        setError("CORS Error: Unable to connect to the server. Please check if the server is running and CORS is properly configured.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch lead status");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e) => {
    const selectedId = Number(e.target.value);
    const selectedUser = userList.find(u => u.user_id === selectedId);
    setUserData(selectedUser || { user_id: null, user_name: "" });
  };

  const handleTransferFetch = async () => {
    setTransferError("");
    setTransferLoading(true);
    try {
      const response = await api.get('/api/users/getUserByUserId', {
        params: { user_id: transferUserId }
      });
      const user = response.data;
      if (user && user.user_id) {
        setUserData(user);
        setShowTransfer(false);
        setTransferUserId("");
      } else {
        setTransferError("User not found");
      }
    } catch (err) {
      setTransferError("User not found");
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="update-lead-card">
      <div className="update-lead-header">
        <i className="fa-solid fa-pen-to-square"></i>
        <span>Update Lead Status</span>
      </div>
      <form className="update-lead-form" autoComplete="off">
        <div className="update-lead-field">
          <label htmlFor="lead_id">
            <i className="fa-solid fa-id-badge"></i> Lead ID <span className="required">*</span>
          </label>
          <div className="update-lead-input-row">
            <input
              type="text"
              id="lead_id"
              name="lead_id"
              value={leadId}
              onChange={e => setLeadId(e.target.value)}
              required
              placeholder="Enter Lead ID"
            />
            <button 
              type="button" 
              className="btn check"
              onClick={handleCheckStatus}
              disabled={loading}
            >
              <i className="fa-solid fa-magnifying-glass"></i> 
              {loading ? "CHECKING..." : "CHECK STATUS"}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
        <div className="update-lead-field">
          <label htmlFor="user_id">
            <i className="fa-solid fa-user"></i> Assigned User
          </label>
          <div className="update-lead-input-row">
            <input
              type="text"
              id="user_id"
              name="user_id"
              value={userData.user_id ? `${userData.user_id} - ${userData.user_name}` : "Not Assigned"}
              readOnly
              className="user-id-input"
              placeholder="User ID will be auto-filled"
            />
            <div className="btn check" style={{ visibility: 'hidden' }}>
              <i className="fa-solid fa-magnifying-glass"></i> CHECK STATUS
            </div>
            <button
              type="button"
              className="btn check"
              style={{ marginLeft: '10px' }}
              onClick={() => setShowTransfer(v => !v)}
            >
              <i className="fa-solid fa-right-left"></i> TRANSFER LEAD
            </button>
          </div>
          {showTransfer && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                placeholder="Enter User ID"
                value={transferUserId}
                onChange={e => setTransferUserId(e.target.value)}
                style={{ width: '160px', height: '40px', borderRadius: '5px', border: '1.5px solid #e0e0e0', padding: '0 12px', fontSize: '15px' }}
              />
              <button
                type="button"
                className="btn check"
                onClick={handleTransferFetch}
                disabled={transferLoading || !transferUserId}
              >
                {transferLoading ? 'Fetching...' : 'Fetch User'}
              </button>
              {transferError && <span className="error-message">{transferError}</span>}
            </div>
          )}
        </div>
        <div className="update-lead-field">
          <label htmlFor="status">
            <i className="fa-solid fa-signal"></i>Application&nbsp;Status <span className="required">*</span>
          </label>
          <select
            id="status"
            name="status"
            required
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="" disabled>SELECT</option>
            {masterStatus.map((status) => (
              <option key={status.status_id} value={status.status_name}>
                {status.status_name}
              </option>
            ))}
          </select>
        </div>
        <div className="update-lead-field">
          <label htmlFor="remarks">
            <i className="fa-solid fa-comment-dots"></i> Remarks <span className="required">*</span>
          </label>
          <textarea
            id="remarks"
            name="remarks"
            rows="5"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            required
            placeholder="Enter remarks here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn update"
          disabled={!status}
        >
          <i className="fa-solid fa-paper-plane"></i> UPDATE STATUS
        </button>
      </form>
    </div>
  );
};

export default UpdateLead; 