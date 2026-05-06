// ==========================================
// FILE: components/Sidebar.jsx
// ==========================================

import React, {
  useState,
} from 'react';

import {
  Link,
  useLocation,
} from 'react-router-dom';

import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaDumbbell,
} from 'react-icons/fa';

const Sidebar = () => {

  const [open,
    setOpen] =
    useState(false);

  const location =
    useLocation();

  const menuItems = [

    {
      name: 'Dashboard',
      path: '/',
      icon: <FaHome />,
    },

    {
      name: 'Members',
      path: '/members',
      icon: <FaUsers />,
    },

    {
      name: 'Attendance',
      path: '/attendance',
      icon: <FaCalendarCheck />,
    },

    {
      name: 'Payments',
      path: '/payments',
      icon: <FaMoneyBillWave />,
    },

  ];

  return (

    <>

      {/* MOBILE TOPBAR */}

      <div className="mobile-navbar">

        <div className="logo-section">

          <FaDumbbell className="logo-icon" />

          <h2>
            GYM ADMIN
          </h2>

        </div>

        <button
          className="menu-btn"
          onClick={() =>
            setOpen(!open)
          }
        >

          {

            open

              ? <FaTimes />

              : <FaBars />

          }

        </button>

      </div>

      {/* OVERLAY */}

      {

        open && (

          <div
            className="overlay"
            onClick={() =>
              setOpen(false)
            }
          />

        )

      }

      {/* SIDEBAR */}

      <div
        className={`sidebar ${
          open
            ? 'sidebar-open'
            : ''
        }`}
      >

        {/* LOGO */}

        <div className="sidebar-header">

          <div className="logo-container">

            <div className="logo-circle">

              <FaDumbbell />

            </div>

            <div>

              <h2>
                GYM ADMIN
              </h2>

              <p>
                Fitness Dashboard
              </p>

            </div>

          </div>

        </div>

        {/* MENU */}

        <div className="menu-list">

          {

            menuItems.map(item => (

              <Link

                key={item.path}

                to={item.path}

                className={`menu-item ${
                  location.pathname === item.path
                    ? 'active'
                    : ''
                }`}

                onClick={() =>
                  setOpen(false)
                }

              >

                <span className="menu-icon">

                  {item.icon}

                </span>

                <span>

                  {item.name}

                </span>

              </Link>

            ))

          }

        </div>

        {/* FOOTER */}

        <div className="sidebar-footer">

          <div className="admin-box">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt=""
            />

            <div>

              <h4>
                Admin
              </h4>

              <p>
                Gym Manager
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* CSS */}

      <style>{`

        *{
          box-sizing:border-box;
        }

        /* MOBILE NAVBAR */

        .mobile-navbar{
          display:none;
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:70px;
          background:#111827;
          z-index:2000;
          padding:0 20px;
          align-items:center;
          justify-content:space-between;
          box-shadow:0 4px 12px rgba(0,0,0,0.2);
        }

        .logo-section{
          display:flex;
          align-items:center;
          gap:10px;
        }

        .logo-section h2{
          color:white;
          font-size:20px;
        }

        .logo-icon{
          color:#22c55e;
          font-size:22px;
        }

        .menu-btn{
          background:none;
          border:none;
          color:white;
          font-size:24px;
          cursor:pointer;
        }

        /* SIDEBAR */

        .sidebar{
          width:280px;
          min-height:100vh;
          background:#111827;
          padding:25px 20px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          position:sticky;
          top:0;
          transition:0.3s ease;
        }

        /* HEADER */

        .sidebar-header{
          margin-bottom:40px;
        }

        .logo-container{
          display:flex;
          align-items:center;
          gap:15px;
        }

        .logo-circle{
          width:55px;
          height:55px;
          border-radius:16px;
          background:linear-gradient(
            135deg,
            #22c55e,
            #16a34a
          );
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:24px;
        }

        .logo-container h2{
          color:white;
          font-size:22px;
          margin-bottom:5px;
        }

        .logo-container p{
          color:#9ca3af;
          font-size:13px;
        }

        /* MENU */

        .menu-list{
          display:flex;
          flex-direction:column;
          gap:14px;
          flex:1;
        }

        .menu-item{
          display:flex;
          align-items:center;
          gap:15px;
          padding:16px;
          border-radius:16px;
          text-decoration:none;
          color:#d1d5db;
          transition:0.3s;
          font-size:15px;
          font-weight:600;
        }

        .menu-item:hover{
          background:#1f2937;
          transform:translateX(5px);
        }

        .menu-item.active{
          background:linear-gradient(
            135deg,
            #22c55e,
            #16a34a
          );
          color:white;
          box-shadow:0 8px 20px rgba(34,197,94,0.3);
        }

        .menu-icon{
          font-size:18px;
        }

        /* FOOTER */

        .sidebar-footer{
          margin-top:30px;
        }

        .admin-box{
          display:flex;
          align-items:center;
          gap:12px;
          background:#1f2937;
          padding:14px;
          border-radius:18px;
        }

        .admin-box img{
          width:50px;
          height:50px;
          border-radius:50%;
          object-fit:cover;
        }

        .admin-box h4{
          color:white;
          margin-bottom:4px;
        }

        .admin-box p{
          color:#9ca3af;
          font-size:13px;
        }

        /* OVERLAY */

        .overlay{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.5);
          z-index:999;
        }

        /* MOBILE RESPONSIVE */

        @media(max-width:768px){

          .mobile-navbar{
            display:flex;
          }

          .sidebar{
            position:fixed;
            top:0;
            left:-100%;
            width:280px;
            height:100vh;
            z-index:1500;
            overflow-y:auto;
          }

          .sidebar-open{
            left:0;
          }
            .sidebar-header{
             padding-top:70px;
            }

        }

      `}</style>

    </>

  );

};

export default Sidebar;