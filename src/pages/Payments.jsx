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
  FaFilter,
} from 'react-icons/fa';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // State for Filter
  const [selectedImage, setSelectedImage] = useState(null);

  // ==========================================
  // FETCH PAYMENTS (RECENT FIRST)
  // ==========================================
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'payments'),
      snapshot => {
        const raw = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const grouped = raw.reduce((acc, current) => {
          const uid = current.uid;
          if (!acc[uid]) {
            acc[uid] = {
              uid,
              email: current.email,
              upiId: current.upiId,
              allPayments: [],
              totalPaid: 0,
              latestTime: 0,
            };
          }

          acc[uid].allPayments.push(current);

          if (current.status === 'approved') {
            acc[uid].totalPaid += Number(current.amount);
          }

          // Handle both Timestamp objects and raw numeric timestamps
          const currentMillis = current.createdAt?.toMillis 
            ? current.createdAt.toMillis() 
            : (typeof current.createdAt === 'number' ? current.createdAt : 0);
          
          // Track the absolute latest activity for this user to sort the grid
          if (currentMillis > acc[uid].latestTime) {
            acc[uid].latestPayment = current;
            acc[uid].latestTime = currentMillis;
          }

          return acc;
        }, {});

        // Sort users: Most recent transaction overall appears first
        const sortedList = Object.values(grouped).sort((a, b) => b.latestTime - a.latestTime);

        setPayments(sortedList);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // ACTIONS
  // ==========================================
  const approvePayment = async (paymentId, uid, planType) => {
    try {
      const expiry = new Date();
      // Logic: If plan contains "Yearly", add 12 months, otherwise add 1 month
      if (planType?.toLowerCase().includes('yearly')) {
        expiry.setFullYear(expiry.getFullYear() + 1);
      } else {
        expiry.setMonth(expiry.getMonth() + 1);
      }

      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'approved',
        expiryDate: expiry.toDateString(),
      });

      await updateDoc(doc(db, 'users', uid), {
        premium: true,
        paymentStatus: 'approved',
        premiumExpiry: expiry.toDateString(),
      });

      alert('Protocol Authorized');
    } catch (error) {
      console.error(error);
    }
  };

  const rejectPayment = async paymentId => {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'rejected',
      });
      alert('Transaction Terminated');
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // FILTER & SEARCH LOGIC
  // ==========================================
  const filteredResults = useMemo(() => {
    return payments.filter(user => {
      const matchesSearch = user.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.latestPayment?.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  // ==========================================
  // ANALYTICS
  // ==========================================
  const totalRevenue = payments.reduce((total, item) => total + item.totalPaid, 0);
  const pendingCount = payments.filter(item => item.latestPayment?.status === 'pending').length;

  if (loading) return <div className="loader">INITIALIZING_VAULT...</div>;

  return (
    <div className="payments-page">
      {/* HEADER */}
      <div className="payments-header">
        <div>
          <h1>Financial Control</h1>
          <p>Authorize biometric evolution payments</p>
        </div>
      </div>

      {/* KPI STATS */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="icon green"><FaWallet /></div>
          <div>
            <span>Total Revenue</span>
            <h2>₹{totalRevenue.toLocaleString()}</h2>
          </div>
        </div>
        <div className="stats-card">
          <div className="icon blue"><FaUsers /></div>
          <div>
            <span>Total Athletes</span>
            <h2>{payments.length}</h2>
          </div>
        </div>
        <div className="stats-card">
          <div className="icon orange"><FaClock /></div>
          <div>
            <span>Pending Verifications</span>
            <h2>{pendingCount}</h2>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="controls-row">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search athlete email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ALL_STATUS</option>
            <option value="pending">PENDING</option>
            <option value="approved">APPROVED</option>
            <option value="rejected">REJECTED</option>
          </select>
        </div>
      </div>

      {/* DATA GRID */}
      <div className="payments-grid">
        {filteredResults.map(user => (
          <div key={user.uid} className="payment-card">
            <div className="card-header">
              <div>
                <h2>{user.email}</h2>
                <p>UID: {user.uid.substring(0, 12)}...</p>
              </div>
              <div className={`status ${user.latestPayment?.status}`}>
                {user.latestPayment?.status}
              </div>
            </div>

            <div className="image-wrapper">
              <img
                src={user.latestPayment?.screenshot || 'https://via.placeholder.com/400x250?text=NO_RECEIPT_FOUND'}
                alt="Receipt"
                className="payment-image"
              />
              {user.latestPayment?.screenshot && (
                <button className="expand-btn" onClick={() => setSelectedImage(user.latestPayment?.screenshot)}>
                  <FaExpand />
                </button>
              )}
            </div>

            <div className="details-box">
              <div>
                <span>Selected Plan</span>
                <h4>{user.latestPayment?.plan}</h4>
              </div>
              <div>
                <span>Amount Paid</span>
                <h4>₹{user.latestPayment?.amount}</h4>
              </div>
            </div>

            <div className="date-box">
              <span>Transaction Timestamp</span>
              <p>
                {user.latestPayment?.createdAt?.toDate 
                  ? user.latestPayment.createdAt.toDate().toLocaleString() 
                  : (typeof user.latestPayment?.createdAt === 'number' 
                      ? new Date(user.latestPayment.createdAt).toLocaleString() 
                      : 'DATE_ERROR')}
              </p>
            </div>

            {user.latestPayment?.status === 'pending' && (
              <div className="buttons">
                <button className="approve-btn" onClick={() => approvePayment(user.latestPayment.id, user.uid, user.latestPayment.plan)}>
                  <FaCheckCircle /> Authorize
                </button>
                <button className="reject-btn" onClick={() => rejectPayment(user.latestPayment.id)}>
                  <FaTimesCircle /> Terminate
                </button>
              </div>
            )}

            <div className="history-section">
              <h3>Previous Protocols</h3>
              {user.allPayments
                .sort((a, b) => {
                  const bVal = b.createdAt?.toMillis ? b.createdAt.toMillis() : (typeof b.createdAt === 'number' ? b.createdAt : 0);
                  const aVal = a.createdAt?.toMillis ? a.createdAt.toMillis() : (typeof a.createdAt === 'number' ? a.createdAt : 0);
                  return bVal - aVal;
                })
                .slice(0, 3)
                .map(pay => (
                  <div key={pay.id} className="history-item">
                    <div>
                      <h4>{pay.plan}</h4>
                      <p>{pay.createdAt?.toDate ? pay.createdAt.toDate().toLocaleDateString() : 'LEGACY_DATA'}</p>
                    </div>
                    <div className="history-right">
                      <span>₹{pay.amount}</span>
                      <small className={pay.status}>{pay.status}</small>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Fullscreen Evidence" className="full-image" />
        </div>
      )}

      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family: 'Inter', sans-serif; }
        .payments-page { min-height:100vh; background:#f4f7fb; padding:25px; }
        .payments-header h1 { font-size:32px; color:#111827; font-weight:800; letter-spacing: -1px; }
        .payments-header p { color:#6b7280; margin-top:4px; font-size: 14px; }

        .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; margin:25px 0; }
        .stats-card { background:white; border-radius:20px; padding:20px; display:flex; align-items:center; gap:15px; border: 1px solid #edf2f7; }
        .icon { width:60px; height:60px; border-radius:15px; display:flex; justify-content:center; align-items:center; color:white; font-size:22px; }
        .green { background: #10b981; }
        .blue { background: #3b82f6; }
        .orange { background: #f59e0b; }
        .stats-card h2 { font-size: 24px; color: #1a202c; }
        .stats-card span { font-size: 13px; color: #718096; font-weight: 500; }

        .controls-row { display: flex; gap: 15px; margin-bottom: 25px; flex-wrap: wrap; }
        .search-box { flex: 2; min-width: 280px; background:white; height:54px; border-radius:12px; display:flex; align-items:center; padding:0 15px; border: 1px solid #e2e8f0; }
        .filter-box { flex: 1; min-width: 180px; background:white; height:54px; border-radius:12px; display:flex; align-items:center; padding:0 15px; border: 1px solid #e2e8f0; }
        .search-icon, .filter-icon { color:#a0aec0; }
        .search-box input, .filter-box select { flex:1; height:100%; border:none; outline:none; margin-left:10px; font-size:14px; background:none; color: #2d3748; }

        .payments-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(380px, 1fr)); gap:20px; }
        .payment-card { background:white; border-radius:20px; padding:20px; border: 1px solid #edf2f7; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        
        .card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 15px; }
        .card-header h2 { font-size:16px; color:#1a202c; word-break:break-all; font-weight: 700; }
        .card-header p { font-size: 11px; color: #a0aec0; font-family: monospace; }
        .status { padding:6px 10px; border-radius:8px; font-size:11px; font-weight:800; text-transform:uppercase; color:white; }
        .pending { background:#f59e0b; }
        .approved { background:#10b981; }
        .rejected { background:#ef4444; }

        .image-wrapper { position:relative; margin-bottom: 15px; border-radius: 12px; overflow: hidden; background: #f7fafc; border: 1px solid #e2e8f0; }
        .payment-image { width:100%; height:200px; object-fit:contain; transition: 0.3s; }
        .expand-btn { position:absolute; top:10px; right:10px; width:36px; height:36px; border:none; border-radius:8px; background:rgba(0,0,0,0.5); color:white; cursor:pointer; }

        .details-box { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom: 15px; }
        .details-box div { background:#f8fafc; padding:12px; border-radius:12px; border: 1px solid #edf2f7; }
        .details-box span { color:#718096; font-size:11px; font-weight: 600; text-transform: uppercase; }
        .details-box h4 { margin-top:3px; color:#2d3748; font-size:15px; }

        .date-box { background:#2d3748; border-radius:12px; padding:12px; margin-bottom: 15px; }
        .date-box span { color:#a0aec0; font-size:11px; font-weight: 600; }
        .date-box p { margin-top:3px; color:white; font-size: 13px; font-weight: 500; }

        .buttons { display:flex; gap:10px; margin-bottom: 20px; }
        .approve-btn { flex:1; background:#10b981; border:none; height:44px; border-radius:10px; color:white; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; font-size: 14px; }
        .reject-btn { flex:1; background:#ef4444; border:none; height:44px; border-radius:10px; color:white; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; font-size: 14px; }

        .history-section { border-top: 1px dashed #e2e8f0; padding-top: 15px; }
        .history-section h3 { font-size: 14px; margin-bottom: 12px; color: #4a5568; font-weight: 700; }
        .history-item { background:#f8fafc; border-radius:10px; padding:10px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border: 1px solid #edf2f7; }
        .history-item h4 { font-size:13px; color:#2d3748; }
        .history-item p { font-size:11px; color:#718096; }
        .history-right { text-align:right; }
        .history-right span { display:block; font-weight:700; font-size:13px; color: #2d3748; }
        .history-right small { padding:3px 6px; border-radius:5px; color:white; font-size:9px; text-transform:uppercase; font-weight: 800; }

        .modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:10000; padding:40px; }
        .full-image { max-width:100%; max-height:100%; border-radius:12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }

        @media(max-width:768px){
          .payments-page { padding:15px; padding-top: 75px; }
          .controls-row { flex-direction: column; gap: 10px; }
          .search-box, .filter-box { width: 100%; padding: 10px; }
          .payments-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Payments;