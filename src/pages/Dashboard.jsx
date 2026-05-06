// ==========================================
// FILE: pages/Dashboard.jsx
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
  FaUsers,
  FaCalendarCheck,
  FaFire,
  FaSearch,
} from 'react-icons/fa';

const Dashboard = () => {

  const [users, setUsers] =
    useState([]);

  const [search,
    setSearch] =
    useState('');

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

              // ONLY USERS

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
  // TOTALS
  // ==========================================

  const totalAttendance =
    users.reduce(

      (total, user) =>

        total +
        (user.attendanceCount || 0),

      0

    );

  const activeUsers =
    users.filter(
      user =>
        user.attendanceCount > 0
    ).length;

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
  // UI
  // ==========================================

  return (

    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Gym management overview
          </p>

        </div>

        <div className="admin-badge">

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt=""
          />

          <div>

            <h3>
              Admin Panel
            </h3>

            <span>
              Live Database
            </span>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stats-card">

          <div className="stats-icon green">

            <FaUsers />

          </div>

          <div>

            <span>
              Total Members
            </span>

            <h2>
              {users.length}
            </h2>

          </div>

        </div>

        <div className="stats-card">

          <div className="stats-icon blue">

            <FaCalendarCheck />

          </div>

          <div>

            <span>
              Total Attendance
            </span>

            <h2>
              {totalAttendance}
            </h2>

          </div>

        </div>

        <div className="stats-card">

          <div className="stats-icon orange">

            <FaFire />

          </div>

          <div>

            <span>
              Active Users
            </span>

            <h2>
              {activeUsers}
            </h2>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input

          type="text"

          placeholder="Search members..."

          value={search}

          onChange={e =>
            setSearch(
              e.target.value
            )
          }

        />

      </div>

      {/* RECENT USERS */}

      <div className="recent-section">

        <div className="section-header">

          <h2>
            Recent Members
          </h2>

          <span>
            {filteredUsers.length} Users
          </span>

        </div>

        <div className="users-grid">

          {

            filteredUsers.map(user => (

              <div
                key={user.id}
                className="user-card"
              >

                {/* PROFILE */}

                <div className="user-top">

                  <img

                    src={
                      user?.profileImage ||

                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                    }

                    alt=""

                  />

                  <div>

                    <h3>
                      {user?.name}
                    </h3>

                    <p>
                      {user?.email}
                    </p>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="details-grid">

                  <div className="detail-box">

                    <span>
                      Attendance
                    </span>

                    <h4>
                      {
                        user?.attendanceCount || 0
                      }
                    </h4>

                  </div>

                  <div className="detail-box">

                    <span>
                      Streak
                    </span>

                    <h4>
                      {
                        user?.streak || 0
                      }
                    </h4>

                  </div>

                </div>

                {/* LAST ATTENDANCE */}

                <div className="last-attendance">

                  <span>
                    Last Attendance
                  </span>

                  <p>
                    {
                      user?.lastAttendance ||

                      'No attendance'
                    }
                  </p>

                </div>

              </div>

            ))

          }

        </div>

      </div>

      {/* CSS */}

      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,sans-serif;
        }

        .dashboard-page{
          min-height:100vh;
          background:#f4f7fb;
          padding:25px;
        }

        /* HEADER */

        .dashboard-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          margin-bottom:28px;
          flex-wrap:wrap;
        }

        .dashboard-header h1{
          font-size:36px;
          font-weight:800;
          color:#111827;
        }

        .dashboard-header p{
          margin-top:6px;
          color:#6b7280;
        }

        .admin-badge{
          background:white;
          padding:14px 18px;
          border-radius:20px;
          display:flex;
          align-items:center;
          gap:14px;
          box-shadow:0 10px 20px rgba(0,0,0,0.06);
        }

        .admin-badge img{
          width:55px;
          height:55px;
          border-radius:50%;
        }

        .admin-badge h3{
          color:#111827;
        }

        .admin-badge span{
          color:#6b7280;
          font-size:13px;
        }

        /* STATS */

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:22px;
          margin-bottom:28px;
        }

        .stats-card{
          background:white;
          border-radius:24px;
          padding:24px;
          display:flex;
          align-items:center;
          gap:18px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
        }

        .stats-icon{
          width:65px;
          height:65px;
          border-radius:18px;
          display:flex;
          justify-content:center;
          align-items:center;
          font-size:26px;
          color:white;
        }

        .green{
          background:linear-gradient(
            135deg,
            #22c55e,
            #16a34a
          );
        }

        .blue{
          background:linear-gradient(
            135deg,
            #3b82f6,
            #2563eb
          );
        }

        .orange{
          background:linear-gradient(
            135deg,
            #f97316,
            #ea580c
          );
        }

        .stats-card span{
          color:#6b7280;
          font-size:14px;
        }

        .stats-card h2{
          font-size:32px;
          margin-top:6px;
          color:#111827;
        }

        /* SEARCH */

        .search-box{
          width:100%;
          background:white;
          height:58px;
          border-radius:18px;
          display:flex;
          align-items:center;
          padding:0 18px;
          margin-bottom:30px;
          box-shadow:0 6px 18px rgba(0,0,0,0.05);
        }

        .search-icon{
          color:#9ca3af;
          font-size:18px;
        }

        .search-box input{
          flex:1;
          height:100%;
          border:none;
          outline:none;
          margin-left:12px;
          font-size:15px;
          background:none;
        }

        /* SECTION */

        .recent-section{
          margin-top:10px;
        }

        .section-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:22px;
          flex-wrap:wrap;
          gap:10px;
        }

        .section-header h2{
          font-size:28px;
          color:#111827;
        }

        .section-header span{
          background:white;
          padding:10px 16px;
          border-radius:14px;
          color:#6b7280;
          font-size:14px;
          box-shadow:0 4px 12px rgba(0,0,0,0.05);
        }

        /* USERS GRID */

        .users-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:24px;
        }

        /* USER CARD */

        .user-card{
          background:white;
          border-radius:24px;
          padding:22px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
          transition:0.3s;
        }

        .user-card:hover{
          transform:translateY(-5px);
        }

        .user-top{
          display:flex;
          align-items:center;
          gap:16px;
        }

        .user-top img{
          width:80px;
          height:80px;
          border-radius:22px;
          object-fit:cover;
        }

        .user-top h3{
          color:#111827;
          font-size:22px;
        }

        .user-top p{
          color:#6b7280;
          margin-top:6px;
          font-size:14px;
          word-break:break-word;
        }

        /* DETAILS */

        .details-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:14px;
          margin-top:22px;
        }

        .detail-box{
          background:#f9fafb;
          border-radius:18px;
          padding:18px;
          text-align:center;
        }

        .detail-box span{
          color:#6b7280;
          font-size:13px;
        }

        .detail-box h4{
          margin-top:8px;
          font-size:26px;
          color:#111827;
        }

        /* LAST ATTENDANCE */

        .last-attendance{
          margin-top:20px;
          background:#f9fafb;
          border-radius:18px;
          padding:18px;
        }

        .last-attendance span{
          color:#6b7280;
          font-size:13px;
        }

        .last-attendance p{
          margin-top:8px;
          color:#111827;
          line-height:1.5;
          font-weight:600;
        }

        /* MOBILE */

        @media(max-width:768px){

          .dashboard-page{
            padding:15px;
            padding-top:90px;
          }

          .dashboard-header{
            flex-direction:column;
            align-items:flex-start;
          }

          .dashboard-header h1{
            font-size:30px;
          }

          .admin-badge{
            width:100%;
          }

          .stats-grid{
            grid-template-columns:1fr;
            gap:18px;
          }

          .stats-card{
            padding:20px;
            border-radius:20px;
          }

          .stats-icon{
            width:58px;
            height:58px;
            font-size:22px;
          }

          .stats-card h2{
            font-size:28px;
          }

          .section-header{
            flex-direction:column;
            align-items:flex-start;
          }

          .section-header h2{
            font-size:24px;
          }

          .users-grid{
            grid-template-columns:1fr;
            gap:18px;
          }

          .user-card{
            padding:18px;
            border-radius:20px;
          }

          .user-top{
            align-items:flex-start;
          }

          .user-top img{
            width:68px;
            height:68px;
          }

          .user-top h3{
            font-size:20px;
          }

          .details-grid{
            grid-template-columns:1fr;
          }

        }

      `}</style>

    </div>

  );

};

export default Dashboard;