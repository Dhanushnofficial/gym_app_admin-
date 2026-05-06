// ==========================================
// ADMIN LOGIN + FIREBASE ACCESS
// FILE: AdminLogin.jsx
// ==========================================

import React, {
  useState,
} from 'react';

import {
  signInWithEmailAndPassword,
} from 'firebase/auth';

import {
  auth,
  db,
} from './firebase';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

import {
  useNavigate,
} from 'react-router-dom';

const AdminLogin = () => {

  const navigate =
    useNavigate();

  const [email,
    setEmail] =
    useState('');

  const [password,
    setPassword] =
    useState('');

  const [loading,
    setLoading] =
    useState(false);

  const login =
    async e => {

      e.preventDefault();

      try {

        setLoading(true);

        // ==========================================
        // FIREBASE LOGIN
        // ==========================================

        const userCredential =
          await signInWithEmailAndPassword(

            auth,
            email,
            password

          );

        const user =
          userCredential.user;

        // ==========================================
        // CHECK ADMIN
        // ==========================================

        const userRef =
          doc(
            db,
            'users',
            user.uid
          );

        const userSnap =
          await getDoc(
            userRef
          );

        if (
          userSnap.exists()
        ) {

          const data =
            userSnap.data();

          // ==========================================
          // ADMIN ACCESS
          // ==========================================

          if (
            data?.userType ===
            'admin'
          ) {

            localStorage.setItem(
              'admin',
              JSON.stringify(data)
            );

            navigate(
              '/admin-dashboard'
            );

          } else {

            alert(
              'Access Denied'
            );

          }

        }

      } catch (error) {

        console.log(error);

        alert(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="login-container">

      <form
        className="login-card"
        onSubmit={login}
      >

        <h1>
          ADMIN LOGIN
        </h1>

        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={e =>
            setEmail(
              e.target.value
            )
          }

        />

        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={e =>
            setPassword(
              e.target.value
            )
          }

        />

        <button type="submit">

          {

            loading
              ? 'Loading...'
              : 'LOGIN'

          }

        </button>

      </form>

    </div>

  );

};

export default AdminLogin;