import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UpdateLead.css";
import baseURL from "../Utils/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: baseURL.API_BASEPATH,
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
  const [activeUsers, setActiveUsers] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Effect to clear success message after 3 seconds
  useEffect(() => {
    let timeoutId;
    if (submitSuccess) {
      timeoutId = setTimeout(() => {
        setSubmitSuccess("");
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [submitSuccess]);

  const handleCheckStatus = async () => {
    if (!leadId) {
      setError("Please enter a Lead ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("Making request with lead_id:", leadId);
      const response = await api.get('/leads/getLeadStatusByLeadId', {
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
      setActiveUsers(response.data.activeUsers || []);
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
    const selectedUser = activeUsers.find(u => u.user_id === selectedId);
    setUserData(selectedUser || { user_id: null, user_name: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!leadId || !status || !userData.user_id || !remarks) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const selectedStatus = masterStatus.find(s => s.status_name === status);
      if (!selectedStatus) {
        throw new Error("Invalid status selected");
      }

      const payload = {
        lead_id: Number(leadId),
        lead_status_id: selectedStatus.status_id,
        user_id: userData.user_id,
        remark: remarks // Always include remarks as it's now mandatory
      };

      const response = await api.post('/leads/updateLeadStatus', payload);
      setSubmitSuccess("Lead status updated successfully");
      
      // Reset form
      setLeadId("");
      setStatus("");
      setRemarks("");
      setUserData({ user_id: null, user_name: "" });
      setMasterStatus([]);
      setActiveUsers([]);
    } catch (err) {
      console.error("Error updating lead status:", err);
      setSubmitError(err.response?.data?.message || "Failed to update lead status");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="update-lead-card">
      <div className="update-lead-header">
        <i className="fa-solid fa-pen-to-square"></i>
        <span>Update Lead Status</span>
      </div>
      <form className="update-lead-form" autoComplete="off" onSubmit={handleSubmit}>
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
            <i className="fa-solid fa-user"></i> Assigned User <span className="required">*</span>
          </label>
          <select
            id="user_id"
            name="user_id"
            value={userData.user_id || ""}
            onChange={handleUserChange}
            disabled={!activeUsers.length}
            className="user-select"
            required
          >
            <option value="" disabled>SELECT USER</option>
            {activeUsers.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                  {user.user_id} - {user.name || "Unnamed User"}
              </option>
            ))}
          </select>
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
            disabled={!masterStatus.length}
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
            placeholder="Enter remarks here..."
            required
          ></textarea>
        </div>
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
        <button
          type="submit"
          className="btn update"
          disabled={!status || submitLoading || !remarks}
        >
          <i className="fa-solid fa-paper-plane"></i> 
          {submitLoading ? "UPDATING..." : "UPDATE STATUS"}
        </button>
      </form>
    </div>
  );
};

export default UpdateLead; 