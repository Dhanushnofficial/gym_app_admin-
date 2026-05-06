// ==========================================
// FILE: pages/Attendance.jsx
// ==========================================

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  collection,
  onSnapshot,
} from 'firebase/firestore';

import {
  db,
} from '../firebase';

import {
  FaSearch,
  FaFire,
  FaCalendarCheck,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from 'react-icons/fa';

const Attendance = () => {

  const [users, setUsers] =
    useState([]);

  const [search,
    setSearch] =
    useState('');

  // POPUP HISTORY

  const [selectedUser,
    setSelectedUser] =
    useState(null);

  // ==========================================
  // FETCH USERS
  // ==========================================

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(db, 'users'),

        snapshot => {

          const data =
            snapshot.docs

              .map(doc => ({

                id: doc.id,

                ...doc.data(),

              }))

              .filter(
                user =>
                  user.userType === 'user'
              );

          setUsers(data);

        }

      );

    return () =>
      unsubscribe();

  }, []);

  // ==========================================
  // SEARCH FILTER
  // ==========================================

  const filteredUsers =
    useMemo(() => {

      return users.filter(user =>

        user?.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        user?.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    }, [users, search]);

  // ==========================================
  // TOTAL PRESENT
  // ==========================================

  const totalPresent =
    users.filter(
      user =>
        user?.attendance > 0
    ).length;

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="attendance-page">

      {/* HEADER */}

      <div className="header-section">

        <div>

          <h1>
            Attendance
          </h1>

          <p>
            User attendance management
          </p>

        </div>

        <div className="header-card">

          <FaCalendarCheck />

          <div>

            <span>
              Total Users
            </span>

            <h2>
              {users.length}
            </h2>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="search-container">

        <FaSearch className="search-icon" />

        <input

          type="text"

          placeholder="Search users..."

          value={search}

          onChange={e =>
            setSearch(
              e.target.value
            )
          }

        />

      </div>

      {/* GRID */}

      <div className="attendance-grid">

        {

          filteredUsers.map(user => (

            <div
              key={user.id}
              className="attendance-card"
            >

              {/* PROFILE */}

              <div className="profile-section">

                <div className="profile-left">

                  <img

                    src={
                      user?.profileImage ||

                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                    }

                    alt=""

                    className="profile-image"

                  />

                  <div>

                    <h2>
                      {user?.name}
                    </h2>

                    <p>
                      {user?.email}
                    </p>

                  </div>

                </div>

                <div className="attendance-badge">

                  {

                    user?.attendance > 0

                      ? 'Present'

                      : 'Absent'

                  }

                </div>

              </div>

              {/* STATS */}

              <div className="stats-grid">

                <div className="stat-card">

                  <FaCalendarCheck />

                  <div>

                    <span>
                      Attendance
                    </span>

                    <h3>
                      {
                        user?.attendanceCount || 0
                      }
                    </h3>

                  </div>

                </div>

                <div className="stat-card streak-card">

                  <FaFire />

                  <div>

                    <span>
                      Streak
                    </span>

                    <h3>
                      {
                        user?.streak || 0
                      }
                    </h3>

                  </div>

                </div>

              </div>

              {/* LAST ATTENDANCE */}

              <div className="last-attendance">

                <span>
                  Last Attendance
                </span>

                <h4>
                  {
                    user?.lastAttendance ||
                    'No Attendance'
                  }
                </h4>

              </div>

              {/* BUTTON */}

              <button

                className="history-btn"

                onClick={() =>
                  setSelectedUser(user)
                }

              >

                <span>
                  View History
                </span>

                <FaChevronDown />

              </button>

            </div>

          ))

        }

      </div>

      {/* POPUP */}

      {

        selectedUser && (

          <div className="popup-overlay">

            <div className="popup-card">

              {/* TOP */}

              <div className="popup-top">

                <div className="popup-user">

                  <img

                    src={
                      selectedUser?.profileImage ||

                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                    }

                    alt=""

                  />

                  <div>

                    <h2>
                      {selectedUser?.name}
                    </h2>

                    <p>
                      Attendance History
                    </p>

                  </div>

                </div>

                <button

                  className="close-btn"

                  onClick={() =>
                    setSelectedUser(null)
                  }

                >

                  <FaTimes />

                </button>

              </div>

              {/* HISTORY */}

              <div className="history-scroll">

                {

                  selectedUser
                    ?.attendanceHistory
                    ?.length > 0

                    ? (

                      [...selectedUser.attendanceHistory]

                        .reverse()

                        .map((item, index) => (

                          <div
                            key={index}
                            className="history-item"
                          >

                            <div>

                              <h4>
                                {item?.date}
                              </h4>

                              <p>
                                {item?.time}
                              </p>

                            </div>

                            <div className="history-status">

                              Present

                            </div>

                          </div>

                        ))

                    )

                    : (

                      <div className="empty-history">

                        No attendance history

                      </div>

                    )

                }

              </div>

            </div>

          </div>

        )

      }

      {/* CSS */}

      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,sans-serif;
        }

        .attendance-page{
          min-height:100vh;
          background:#f4f7fb;
          padding:25px;
        }

        /* HEADER */

        .header-section{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          margin-bottom:25px;
          flex-wrap:wrap;
        }

        .header-section h1{
          font-size:34px;
          color:#111827;
          font-weight:800;
        }

        .header-section p{
          color:#6b7280;
          margin-top:6px;
        }

        .header-card{
          background:white;
          padding:18px 24px;
          border-radius:20px;
          display:flex;
          align-items:center;
          gap:15px;
          box-shadow:0 8px 20px rgba(0,0,0,0.06);
        }

        .header-card svg{
          font-size:28px;
          color:#22c55e;
        }

        /* SEARCH */

        .search-container{
          width:100%;
          background:white;
          height:58px;
          border-radius:18px;
          display:flex;
          align-items:center;
          padding:0 18px;
          margin-bottom:28px;
          box-shadow:0 6px 15px rgba(0,0,0,0.05);
        }

        .search-icon{
          color:#9ca3af;
          font-size:18px;
        }

        .search-container input{
          flex:1;
          height:100%;
          border:none;
          outline:none;
          margin-left:12px;
          font-size:15px;
          background:none;
        }

        /* GRID */

        .attendance-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(340px,1fr));
          gap:24px;
        }

        /* CARD */

        .attendance-card{
          background:white;
          border-radius:24px;
          padding:22px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
        }

        /* PROFILE */

        .profile-section{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:15px;
        }

        .profile-left{
          display:flex;
          gap:15px;
          flex:1;
        }

        .profile-image{
          width:78px;
          height:78px;
          border-radius:22px;
          object-fit:cover;
        }

        .profile-left h2{
          color:#111827;
          font-size:22px;
        }

        .profile-left p{
          color:#6b7280;
          margin-top:5px;
          font-size:14px;
        }

        .attendance-badge{
          background:#dcfce7;
          color:#16a34a;
          padding:10px 14px;
          border-radius:12px;
          font-size:13px;
          font-weight:700;
        }

        /* STATS */

        .stats-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:15px;
          margin-top:22px;
        }

        .stat-card{
          background:#f9fafb;
          padding:18px;
          border-radius:18px;
          display:flex;
          align-items:center;
          gap:14px;
        }

        .stat-card svg{
          font-size:22px;
          color:#3b82f6;
        }

        .streak-card svg{
          color:#f97316;
        }

        .stat-card span{
          color:#6b7280;
          font-size:13px;
        }

        .stat-card h3{
          margin-top:4px;
          font-size:24px;
        }

        /* LAST ATTENDANCE */

        .last-attendance{
          margin-top:22px;
          background:#f9fafb;
          padding:18px;
          border-radius:18px;
        }

        .last-attendance span{
          color:#6b7280;
          font-size:13px;
        }

        .last-attendance h4{
          margin-top:8px;
          color:#111827;
          line-height:1.5;
        }

        /* BUTTON */

        .history-btn{
          width:100%;
          margin-top:22px;
          height:52px;
          border:none;
          border-radius:16px;
          background:#111827;
          color:white;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:10px;
          cursor:pointer;
          font-size:15px;
          font-weight:700;
        }

        /* POPUP */

        .popup-overlay{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.6);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:999;
          padding:20px;
        }

        .popup-card{
          width:100%;
          max-width:500px;
          max-height:90vh;
          background:white;
          border-radius:24px;
          overflow:hidden;
          display:flex;
          flex-direction:column;
          animation:popupShow 0.3s ease;
        }

        @keyframes popupShow{
          from{
            opacity:0;
            transform:scale(0.9);
          }
          to{
            opacity:1;
            transform:scale(1);
          }
        }

        .popup-top{
          padding:20px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          border-bottom:1px solid #eee;
        }

        .popup-user{
          display:flex;
          align-items:center;
          gap:14px;
        }

        .popup-user img{
          width:65px;
          height:65px;
          border-radius:18px;
          object-fit:cover;
        }

        .popup-user h2{
          color:#111827;
        }

        .popup-user p{
          color:#6b7280;
          margin-top:4px;
        }

        .close-btn{
          width:42px;
          height:42px;
          border:none;
          border-radius:12px;
          background:#f3f4f6;
          cursor:pointer;
          font-size:18px;
        }

        /* SCROLL */

        .history-scroll{
          padding:20px;
          overflow-y:auto;
          max-height:70vh;
        }

        .history-item{
          background:#f9fafb;
          padding:16px;
          border-radius:16px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:14px;
          gap:15px;
        }

        .history-item h4{
          color:#111827;
        }

        .history-item p{
          color:#6b7280;
          margin-top:5px;
          font-size:13px;
        }

        .history-status{
          background:#dcfce7;
          color:#16a34a;
          padding:8px 14px;
          border-radius:12px;
          font-size:13px;
          font-weight:700;
        }

        .empty-history{
          text-align:center;
          padding:30px;
          color:#6b7280;
        }

        /* MOBILE */

        @media(max-width:768px){

          .attendance-page{
            padding:15px;
            padding-top:90px;
          }

          .header-section{
            flex-direction:column;
            align-items:flex-start;
          }

          .header-card{
            width:100%;
          }

          .attendance-grid{
            grid-template-columns:1fr;
          }

          .attendance-card{
            padding:18px;
          }

          .profile-section{
            flex-direction:column;
            align-items:flex-start;
          }

          .stats-grid{
            grid-template-columns:1fr;
          }

          .popup-card{
            max-width:100%;
            max-height:95vh;
            border-radius:20px;
          }

          .history-item{
            flex-direction:column;
            align-items:flex-start;
          }

          .history-status{
            margin-top:10px;
          }

        }

      `}</style>

    </div>

  );

};

export default Attendance;