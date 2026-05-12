// ==========================================
// FILE: App.jsx
// ==========================================

import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import UserAnalytics from './pages/UserAnalytics';


const App = () => {

  return (

    <BrowserRouter>

      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: '#f3f4f6',
        }}
      >

        <Sidebar />

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/members"
              element={<Members />}
            />

            <Route
              path="/attendance"
              element={<Attendance />}
            />


            <Route
              path="/payments"
              element={<Payments />}
            />


           
          </Routes>

        </div>

      </div>

    </BrowserRouter>

  );

};

export default App;