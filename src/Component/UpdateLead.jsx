import React, { useState } from "react";
import "./UpdateLead.css";

const UpdateLead = () => {
  const [status, setStatus] = useState("");
  const [leadId, setLeadId] = useState("");
  const [remarks, setRemarks] = useState("");

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
            <button type="button" className="btn check">
              <i className="fa-solid fa-magnifying-glass"></i> CHECK STATUS
            </button>
          </div>
        </div>
        <div className="update-lead-field">
          <label htmlFor="status">
            <i className="fa-solid fa-signal"></i> Status <span className="required">*</span>
          </label>
          <select
            id="status"
            name="status"
            required
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="" disabled>SELECT</option>
            <option value="Active">Active</option>
            <option value="Nonactive">Nonactive</option>
            <option value="Employed">Employed</option>
            <option value="Unemployed">Unemployed</option>
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