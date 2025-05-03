import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./index.css";

const Layout = () => (
  <div id="dashboard-root">
    <div className="sidebar open">
      <div className="sidebar-header">
        <span>Dashboard</span>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" end>
            <i className="fa-solid fa-house"></i> <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/update-lead">
            <i className="fa-solid fa-list-check"></i> <span>Lead Status</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/bre-bypass">
            <i className="fa-solid fa-code-branch"></i> <span>BRE Bypass</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/search">
            <i className="fa-brands fa-searchengin"></i> <span>Search</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/logout">
            <i className="fa-solid fa-right-from-bracket"></i> <span>Logout</span>
          </NavLink>
        </li>
      </ul>
      <div className="footer">
        Copyright: 2025. All Rights Reserved by Agrim Fincap Pvt. Ltd.
      </div>
    </div>
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

export default Layout; 