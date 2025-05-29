import React, { useState, Suspense } from 'react';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Nav from "../components/Layout/Nav"
const Dashboard = lazy(() => import("../components/Dashboard/Dashboard"))
const SignInForm = lazy(() => import("../components/Auth/SignInForm"))
const SignUpForm = lazy(() => import("../components/Auth/SignUpForm"))
import { fetchUserProfile } from '../store/slices/authSlice';

export default function Home() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [showSignUp, setShowSignUp] = useState(false);
  const dispatch = useDispatch();

  // 🌱 Verifie si le token existe dans le localStorage et si oui, fetch le user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);
  
  const toggleForm = () => {
    setShowSignUp(!showSignUp);
  };


  
  return (
     
    <>

    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col max-w-7xl mx-auto p-8">
      <Nav />
      {isLoggedIn ? (
        <Dashboard />
      ) : showSignUp ? (
        <SignUpForm onToggleForm={toggleForm} />
      ) : (
        <SignInForm onToggleForm={toggleForm} />
      )}
      </div>
      </Suspense>
    </>
  );
}
