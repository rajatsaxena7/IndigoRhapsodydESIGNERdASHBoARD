import React from "react";
import { SidebarWrap } from "./Sidebar.styles";
import { MdOutlineClose } from "react-icons/md";
import { Icons } from "../../assets/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarClose } from "../../redux/slices/sidebarSlices";
import { NavLink } from "react-router-dom";
import { Images } from "../../assets/images";
import { Modal } from "antd";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const isSidebarOpen = useSelector((state) => state.isSidebarOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = () => {
    Modal.confirm({
      title: "Are you sure you want to sign out?",
      content: "This will log you out of the application.",
      okText: "Yes, Sign Out",
      cancelText: "Cancel",
      onOk: () => {
        logout(); // Use the auth context logout function
      },
    });
  };

  return (
    <SidebarWrap className={`${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="brand-logo">
            <img src={Images.Logo} alt="site brand logo" />
          </span>
          <span className="brand-text">Indigo Rhapsody</span>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={() => dispatch(setSidebarClose())}
        >
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to="/" activeClassName="active" className="menu-link">
                <span className="menu-link-icon">
                  <img src={Icons.Graph} alt="" />
                </span>
                <span className="menu-link-text">DashBoard</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/dashboard/products"
                className="menu-link"
                activeClassName="active"
              >
                <span className="menu-link-icon">
                  <img src={Icons.Bag} alt="" />
                </span>
                <span className="menu-link-text">Products</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/dashboard/orders"
                className="menu-link"
                activeClassName="active"
              >
                <span className="menu-link-icon">
                  <img src={Icons.Cart} alt="" />
                </span>
                <span className="menu-link-text">Orders</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/dashboard/shippingDetails"
                className="menu-link"
                activeClassName="active"
              >
                <span className="menu-link-icon">
                  <img src={Icons.TicketYellow} alt="" />
                </span>
                <span className="menu-link-text">Shipping Details</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/dashboard/returnRequest"
                className="menu-link"
                activeClassName="active"
              >
                <span className="menu-link-icon">
                  <img src={Icons.Chart} alt="" />
                </span>
                <span className="menu-link-text">Return Requests</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink
                to="/dashboard/videos"
                className="menu-link"
                activeClassName="active"
              >
                <span className="menu-link-icon">
                  <img src={Icons.Chart} alt="" />
                </span>
                <span className="menu-link-text">Videos</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/dashboard/profile" className="menu-link">
                <span className="menu-link-icon">
                  <img src={Icons.BagGreen} alt="" />
                </span>
                <span className="menu-link-text">Profile</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <button onClick={handleSignOut} className="menu-link">
                <span className="menu-link-icon">
                  <img src={Icons.SignOut} alt="" />
                </span>
                <span className="menu-link-text">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </SidebarWrap>
  );
}

export default Sidebar;
