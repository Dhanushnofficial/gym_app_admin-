// ==========================================
// FILE: pages/Members.jsx
// ==========================================

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../firebase';

import {
  FaUsers,
  FaSearch,
  FaFire,
  FaCalendarCheck,
  FaPhone,
  FaBullseye,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from 'react-icons/fa';

const Members = () => {

  const [users, setUsers] =
    useState([]);

  const [search,
    setSearch] =
    useState('');

  const [editingUser,
    setEditingUser] =
    useState(null);

  const [formData,
    setFormData] =
    useState({});

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
  // DELETE USER
  // ==========================================

  const deleteUser =
    async id => {

      const confirmDelete =
        window.confirm(
          'Delete this member?'
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(db, 'users', id)
        );

        alert(
          'Member Deleted'
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================================
  // EDIT USER
  // ==========================================

  const startEdit =
    user => {

      setEditingUser(user.id);

      setFormData({

        name:
          user.name || '',

        phone:
          user.phone || '',

        goal:
          user.goal || '',

      });

    };

  // ==========================================
  // SAVE USER
  // ==========================================

  const saveUser =
    async id => {

      try {

        await updateDoc(

          doc(db, 'users', id),

          {

            name:
              formData.name,

            phone:
              formData.phone,

            goal:
              formData.goal,

          }

        );

        setEditingUser(null);

        alert(
          'Member Updated'
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="members-page">

      {/* HEADER */}

      <div className="members-header">

        <div>

          <h1>
            Members
          </h1>

          <p>
            Manage gym members
          </p>

        </div>

        <div className="member-count">

          <FaUsers />

          <div>

            <span>
              Total Members
            </span>

            <h2>
              {users.length}
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

      {/* MEMBERS */}

      <div className="members-grid">

        {

          filteredUsers.map(user => (

            <div
              key={user.id}
              className="member-card"
            >

              {/* PROFILE */}

              <div className="member-top">

                <img

                  src={
                    user?.profileImage ||

                    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                  }

                  alt=""

                />

                <div className="member-info">

                  {

                    editingUser === user.id

                      ? (

                        <input

                          value={
                            formData.name
                          }

                          onChange={e =>

                            setFormData({

                              ...formData,

                              name:
                                e.target.value,

                            })

                          }

                        />

                      )

                      : (

                        <h2>
                          {user?.name}
                        </h2>

                      )

                  }

                  <p>
                    {user?.email}
                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="details-grid">

                <div className="detail-box">

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

                <div className="detail-box">

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

              {/* PHONE */}

              <div className="extra-item">

                <FaPhone />

                {

                  editingUser === user.id

                    ? (

                      <input

                        value={
                          formData.phone
                        }

                        onChange={e =>

                          setFormData({

                            ...formData,

                            phone:
                              e.target.value,

                          })

                        }

                      />

                    )

                    : (

                      <span>

                        {
                          user?.phone ||
                          'No Phone'
                        }

                      </span>

                    )

                }

              </div>

              {/* GOAL */}

              <div className="extra-item">

                <FaBullseye />

                {

                  editingUser === user.id

                    ? (

                      <input

                        value={
                          formData.goal
                        }

                        onChange={e =>

                          setFormData({

                            ...formData,

                            goal:
                              e.target.value,

                          })

                        }

                      />

                    )

                    : (

                      <span>

                        {
                          user?.goal ||
                          'No Goal'
                        }

                      </span>

                    )

                }

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

              {/* ACTIONS */}

              <div className="action-buttons">

                {

                  editingUser === user.id

                    ? (

                      <>

                        <button

                          className="save-btn"

                          onClick={() =>
                            saveUser(
                              user.id
                            )
                          }

                        >

                          <FaSave />

                          Save

                        </button>

                        <button

                          className="cancel-btn"

                          onClick={() =>
                            setEditingUser(
                              null
                            )
                          }

                        >

                          <FaTimes />

                          Cancel

                        </button>

                      </>

                    )

                    : (

                      <>

                        <button

                          className="edit-btn"

                          onClick={() =>
                            startEdit(
                              user
                            )
                          }

                        >

                          <FaEdit />

                          Edit

                        </button>

                        <button

                          className="delete-btn"

                          onClick={() =>
                            deleteUser(
                              user.id
                            )
                          }

                        >

                          <FaTrash />

                          Delete

                        </button>

                      </>

                    )

                }

              </div>

            </div>

          ))

        }

      </div>

      {/* CSS */}

      <style>{`

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,sans-serif;
        }

        .members-page{
          min-height:100vh;
          background:#f4f7fb;
          padding:25px;
        }

        /* HEADER */

        .members-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          margin-bottom:28px;
          flex-wrap:wrap;
        }

        .members-header h1{
          font-size:36px;
          font-weight:800;
          color:#111827;
        }

        .members-header p{
          color:#6b7280;
          margin-top:6px;
        }

        .member-count{
          background:white;
          padding:18px 22px;
          border-radius:22px;
          display:flex;
          align-items:center;
          gap:16px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
        }

        .member-count svg{
          font-size:28px;
          color:#22c55e;
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

        /* GRID */

        .members-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(340px,1fr));
          gap:24px;
        }

        /* CARD */

        .member-card{
          background:white;
          border-radius:24px;
          padding:22px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
          transition:0.3s;
        }

        .member-card:hover{
          transform:translateY(-4px);
        }

        /* TOP */

        .member-top{
          display:flex;
          align-items:center;
          gap:16px;
        }

        .member-top img{
          width:82px;
          height:82px;
          border-radius:22px;
          object-fit:cover;
        }

        .member-info{
          flex:1;
        }

        .member-info h2{
          color:#111827;
          font-size:22px;
        }

        .member-info p{
          color:#6b7280;
          margin-top:6px;
          font-size:14px;
          word-break:break-word;
        }

        .member-info input{
          width:100%;
          padding:10px;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:15px;
        }

        /* DETAILS */

        .details-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:15px;
          margin-top:22px;
        }

        .detail-box{
          background:#f9fafb;
          border-radius:18px;
          padding:18px;
          display:flex;
          align-items:center;
          gap:14px;
        }

        .detail-box svg{
          font-size:22px;
          color:#3b82f6;
        }

        .detail-box:nth-child(2) svg{
          color:#f97316;
        }

        .detail-box span{
          color:#6b7280;
          font-size:13px;
        }

        .detail-box h3{
          margin-top:4px;
          color:#111827;
          font-size:24px;
        }

        /* EXTRA */

        .extra-item{
          margin-top:16px;
          background:#f9fafb;
          padding:16px;
          border-radius:16px;
          display:flex;
          align-items:center;
          gap:12px;
        }

        .extra-item svg{
          color:#22c55e;
          font-size:18px;
        }

        .extra-item span{
          color:#111827;
          font-weight:600;
        }

        .extra-item input{
          flex:1;
          border:none;
          background:none;
          outline:none;
          font-size:15px;
        }

        /* LAST ATTENDANCE */

        .last-attendance{
          margin-top:20px;
          background:#111827;
          padding:18px;
          border-radius:18px;
        }

        .last-attendance span{
          color:#9ca3af;
          font-size:13px;
        }

        .last-attendance p{
          margin-top:8px;
          color:white;
          line-height:1.5;
          font-weight:600;
        }

        /* ACTIONS */

        .action-buttons{
          display:flex;
          gap:14px;
          margin-top:22px;
        }

        .action-buttons button{
          flex:1;
          height:50px;
          border:none;
          border-radius:16px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          font-size:15px;
          font-weight:bold;
          cursor:pointer;
          transition:0.3s;
        }

        .edit-btn{
          background:#2563eb;
          color:white;
          padding:10px;
        }

        .delete-btn{
          background:#dc2626;
          color:white;
          padding:10px;
        }

        .save-btn{
          background:#16a34a;
          color:white;
           padding:10px;
        }

        .cancel-btn{
          background:#6b7280;
          color:white;
           padding:10px;
        }

        .action-buttons button:hover{
          opacity:0.9;
          transform:translateY(-2px);
        }

        /* MOBILE */

        @media(max-width:768px){

          .members-page{
            padding:15px;
            padding-top:90px;
          }

          .members-header{
            flex-direction:column;
            align-items:flex-start;
          }

          .members-header h1{
            font-size:30px;
          }

          .member-count{
            width:100%;
          }

          .members-grid{
            grid-template-columns:1fr;
            gap:18px;
          }

          .member-card{
            padding:18px;
            border-radius:20px;
          }

          .member-top{
            align-items:flex-start;
          }

          .member-top img{
            width:70px;
            height:70px;
          }

          .details-grid{
            grid-template-columns:1fr;
          }

          .action-buttons{
            flex-direction:column;
          }

        }

      `}</style>

    </div>

  );

};

export default Members;