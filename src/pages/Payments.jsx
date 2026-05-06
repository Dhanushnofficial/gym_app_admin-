// ==========================================
// FILE: pages/Payments.jsx
// ==========================================

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

import {
  db,
} from '../firebase';

import {
  FaSearch,
  FaWallet,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExpand,
} from 'react-icons/fa';

const Payments = () => {

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState('');

  const [selectedImage,
    setSelectedImage] =
    useState(null);

  // ==========================================
  // FETCH PAYMENTS
  // ==========================================

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(db, 'payments'),

        snapshot => {

          const raw =
            snapshot.docs.map(doc => ({

              id: doc.id,

              ...doc.data(),

            }));

          const grouped =
            raw.reduce((acc, current) => {

              const uid =
                current.uid;

              if (!acc[uid]) {

                acc[uid] = {

                  uid,

                  email:
                    current.email,

                  upiId:
                    current.upiId,

                  allPayments: [],

                  totalPaid: 0,

                };

              }

              acc[uid]
                .allPayments
                .push(current);

              if (
                current.status ===
                'approved'
              ) {

                acc[uid]
                  .totalPaid +=
                  Number(current.amount);

              }

              if (

                current.createdAt >

                (acc[uid]
                  .latestTime || 0)

              ) {

                acc[uid]
                  .latestPayment =
                  current;

                acc[uid]
                  .latestTime =
                  current.createdAt;

              }

              return acc;

            }, {});

          setPayments(
            Object.values(grouped)
          );

          setLoading(false);

        }

      );

    return () =>
      unsubscribe();

  }, []);

  // ==========================================
  // APPROVE PAYMENT
  // ==========================================

  const approvePayment =
    async (
      paymentId,
      uid
    ) => {

      try {

        const nextMonth =
          new Date();

        nextMonth.setMonth(
          nextMonth.getMonth() + 1
        );

        await updateDoc(

          doc(
            db,
            'payments',
            paymentId
          ),

          {

            status: 'approved',

            expiryDate:
              nextMonth.toDateString(),

          }

        );

        await updateDoc(

          doc(
            db,
            'users',
            uid
          ),

          {

            premium: true,

            paymentStatus:
              'approved',

            premiumExpiry:
              nextMonth.toDateString(),

          }

        );

        alert(
          'Payment Approved'
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================================
  // REJECT PAYMENT
  // ==========================================

  const rejectPayment =
    async paymentId => {

      try {

        await updateDoc(

          doc(
            db,
            'payments',
            paymentId
          ),

          {

            status: 'rejected',

          }

        );

        alert(
          'Payment Rejected'
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredPayments =
    useMemo(() => {

      return payments.filter(
        item =>

          item.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [payments, search]);

  // ==========================================
  // TOTALS
  // ==========================================

  const totalRevenue =
    payments.reduce(

      (total, item) =>

        total + item.totalPaid,

      0

    );

  const pendingCount =
    payments.filter(

      item =>

        item
          .latestPayment
          ?.status ===
        'pending'

    ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="loader">

        Loading...

      </div>

    );

  }

  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="payments-page">

      {/* HEADER */}

      <div className="payments-header">

        <div>

          <h1>
            Payments
          </h1>

          <p>
            Manage payment approvals
          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stats-card">

          <div className="icon green">

            <FaWallet />

          </div>

          <div>

            <span>
              Revenue
            </span>

            <h2>
              ₹{totalRevenue}
            </h2>

          </div>

        </div>

        <div className="stats-card">

          <div className="icon blue">

            <FaUsers />

          </div>

          <div>

            <span>
              Users
            </span>

            <h2>
              {payments.length}
            </h2>

          </div>

        </div>

        <div className="stats-card">

          <div className="icon orange">

            <FaClock />

          </div>

          <div>

            <span>
              Pending
            </span>

            <h2>
              {pendingCount}
            </h2>

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input

          type="text"

          placeholder="Search user email..."

          value={search}

          onChange={e =>
            setSearch(
              e.target.value
            )
          }

        />

      </div>

      {/* PAYMENTS */}

      <div className="payments-grid">

        {

          filteredPayments.map(user => (

            <div
              key={user.uid}
              className="payment-card"
            >

              {/* HEADER */}

              <div className="card-header">

                <div>

                  <h2>
                    {user.email}
                  </h2>

                  <p>
                    {user.upiId}
                  </p>

                </div>

                <div
                  className={`status ${user.latestPayment?.status}`}
                >

                  {
                    user.latestPayment?.status
                  }

                </div>

              </div>

              {/* IMAGE */}

              <div className="image-wrapper">

                <img

                  src={
                    user
                      .latestPayment
                      ?.screenshot
                  }

                  alt=""

                  className="payment-image"

                />

                <button

                  className="expand-btn"

                  onClick={() =>
                    setSelectedImage(
                      user
                        .latestPayment
                        ?.screenshot
                    )
                  }

                >

                  <FaExpand />

                </button>

              </div>

              {/* DETAILS */}

              <div className="details-box">

                <div>

                  <span>
                    Plan
                  </span>

                  <h4>
                    {
                      user
                        .latestPayment
                        ?.plan
                    }
                  </h4>

                </div>

                <div>

                  <span>
                    Amount
                  </span>

                  <h4>
                    ₹
                    {
                      user
                        .latestPayment
                        ?.amount
                    }
                  </h4>

                </div>

              </div>

              {/* DATE */}

              <div className="date-box">

                <span>
                  Payment Date
                </span>

                <p>

                  {

                    new Date(

                      user
                        .latestPayment
                        ?.createdAt

                    ).toLocaleDateString()

                  }

                </p>

              </div>

              {/* BUTTONS */}

              {

                user
                  .latestPayment
                  ?.status ===
                'pending' && (

                  <div className="buttons">

                    <button

                      className="approve-btn"

                      onClick={() =>

                        approvePayment(

                          user
                            .latestPayment
                            .id,

                          user.uid

                        )

                      }

                    >

                      <FaCheckCircle />

                      Approve

                    </button>

                    <button

                      className="reject-btn"

                      onClick={() =>

                        rejectPayment(

                          user
                            .latestPayment
                            .id

                        )

                      }

                    >

                      <FaTimesCircle />

                      Reject

                    </button>

                  </div>

                )

              }

              {/* HISTORY */}

              <div className="history-section">

                <h3>
                  Payment History
                </h3>

                {

                  user
                    .allPayments
                    .sort(
                      (a, b) =>
                        b.createdAt -
                        a.createdAt
                    )

                    .map(pay => (

                      <div
                        key={pay.id}
                        className="history-item"
                      >

                        <div>

                          <h4>
                            {pay.plan}
                          </h4>

                          <p>

                            {

                              new Date(

                                pay.createdAt

                              ).toLocaleDateString()

                            }

                          </p>

                        </div>

                        <div className="history-right">

                          <span>
                            ₹{pay.amount}
                          </span>

                          <small
                            className={pay.status}
                          >

                            {pay.status}

                          </small>

                        </div>

                      </div>

                    ))

                }

              </div>

            </div>

          ))

        }

      </div>

      {/* IMAGE MODAL */}

      {

        selectedImage && (

          <div
            className="modal"
            onClick={() =>
              setSelectedImage(null)
            }
          >

            <img
              src={selectedImage}
              alt=""
              className="full-image"
            />

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

        .payments-page{
          min-height:100vh;
          background:#f4f7fb;
          padding:25px;
        }

        .payments-header h1{
          font-size:36px;
          color:#111827;
          font-weight:800;
        }

        .payments-header p{
          color:#6b7280;
          margin-top:6px;
        }

        /* STATS */

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
          gap:22px;
          margin:30px 0;
        }

        .stats-card{
          background:white;
          border-radius:22px;
          padding:22px;
          display:flex;
          align-items:center;
          gap:18px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
        }

        .icon{
          width:65px;
          height:65px;
          border-radius:18px;
          display:flex;
          justify-content:center;
          align-items:center;
          color:white;
          font-size:24px;
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

        /* GRID */

        .payments-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(360px,1fr));
          gap:24px;
        }

        /* CARD */

        .payment-card{
          background:white;
          border-radius:24px;
          padding:22px;
          box-shadow:0 10px 25px rgba(0,0,0,0.06);
        }

        /* HEADER */

        .card-header{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:15px;
        }

        .card-header h2{
          color:#111827;
          font-size:20px;
          word-break:break-word;
        }

        .card-header p{
          color:#6b7280;
          margin-top:6px;
          font-size:14px;
        }

        .status{
          padding:10px 14px;
          border-radius:14px;
          font-size:13px;
          font-weight:bold;
          text-transform:capitalize;
          color:white;
          white-space:nowrap;
        }

        .pending{
          background:#f59e0b;
        }

        .approved{
          background:#16a34a;
        }

        .rejected{
          background:#dc2626;
        }

        /* IMAGE */

        .image-wrapper{
          position:relative;
          margin-top:20px;
        }

        .payment-image{
          width:100%;
          height:240px;
          object-fit:cover;
          border-radius:20px;
        }

        .expand-btn{
          position:absolute;
          top:12px;
          right:12px;
          width:42px;
          height:42px;
          border:none;
          border-radius:14px;
          background:rgba(0,0,0,0.6);
          color:white;
          cursor:pointer;
          font-size:16px;
        }

        /* DETAILS */

        .details-box{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:15px;
          margin-top:22px;
        }

        .details-box div{
          background:#f9fafb;
          padding:18px;
          border-radius:18px;
        }

        .details-box span{
          color:#6b7280;
          font-size:13px;
        }

        .details-box h4{
          margin-top:8px;
          color:#111827;
          font-size:18px;
        }

        /* DATE */

        .date-box{
          margin-top:18px;
          background:#111827;
          border-radius:18px;
          padding:18px;
        }

        .date-box span{
          color:#9ca3af;
          font-size:13px;
        }

        .date-box p{
          margin-top:8px;
          color:white;
          font-weight:600;
        }

        /* BUTTONS */

        .buttons{
          display:flex;
          gap:14px;
          margin-top:22px;
        }

        .approve-btn,
        .reject-btn{
          flex:1;
          border:none;
          height:52px;
          border-radius:16px;
          color:white;
          font-weight:bold;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:10px;
          cursor:pointer;
          font-size:15px;
        }

        .approve-btn{
          background:#16a34a;
        }

        .reject-btn{
          background:#dc2626;
        }

        /* HISTORY */

        .history-section{
          margin-top:24px;
        }

        .history-section h3{
          color:#111827;
          margin-bottom:16px;
        }

        .history-item{
          background:#f9fafb;
          border-radius:16px;
          padding:16px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:14px;
          gap:15px;
        }

        .history-item h4{
          color:#111827;
          font-size:15px;
        }

        .history-item p{
          color:#6b7280;
          margin-top:5px;
          font-size:13px;
        }

        .history-right{
          text-align:right;
        }

        .history-right span{
          display:block;
          font-weight:bold;
          color:#111827;
        }

        .history-right small{
          display:inline-block;
          margin-top:6px;
          padding:6px 10px;
          border-radius:10px;
          color:white;
          text-transform:capitalize;
          font-size:11px;
        }

        /* MODAL */

        .modal{
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background:rgba(0,0,0,0.9);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:999;
          padding:20px;
        }

        .full-image{
          max-width:100%;
          max-height:100%;
          border-radius:20px;
        }

        /* MOBILE */

        @media(max-width:768px){

          .payments-page{
            padding:15px;
            padding-top:90px;
          }

          .payments-header h1{
            font-size:30px;
          }

          .stats-grid{
            grid-template-columns:1fr;
            gap:18px;
          }

          .stats-card{
            padding:18px;
            border-radius:20px;
          }

          .icon{
            width:58px;
            height:58px;
            font-size:22px;
          }

          .payments-grid{
            grid-template-columns:1fr;
            gap:18px;
          }

          .payment-card{
            padding:18px;
            border-radius:20px;
          }

          .card-header{
            flex-direction:column;
          }

          .payment-image{
            height:210px;
          }

          .details-box{
            grid-template-columns:1fr;
          }

          .buttons{
            flex-direction:column;
          }

          .history-item{
            flex-direction:column;
            align-items:flex-start;
          }

          .history-right{
            text-align:left;
            width:100%;
          }
          .approve-btn{
              padding:10px;
              border-radius:7px;
          }
          .reject-btn{
            padding:10px;
            border-radius:7px;
          }
        }

      `}</style>

    </div>

  );

};

export default Payments;