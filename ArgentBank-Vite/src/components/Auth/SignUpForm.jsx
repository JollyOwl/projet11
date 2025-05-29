import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, loginUser } from '../../store/slices/authSlice';
import * as Form from '@radix-ui/react-form';
import PrimaryButton from '../UI/PrimaryButton';
import SecondaryButton from '../UI/SecondaryButton';

function SignUpForm({ onToggleForm }) {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userName: ''
  });

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev, // copie de l'état précédent
      [name]: value // mise à jour du champ spécifique
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First sign up the user
      await dispatch(signupUser(formData)).unwrap();
      
      // If signup is successful, automatically log in
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();
      
    } catch (err) {
      console.error('Error during signup/login:', err);
    }
  };

  return (
    <div>
      <Form.Root onSubmit={handleSubmit} className='flex flex-col gap-6 max-w-sm mx-auto p-4 rounded-md border-2 border-green-600 my-8'>
        <h2 className='text-2xl font-bold'>Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        <Form.Field name="email" className='flex flex-col gap-1'>
          <Form.Label className='block font-bold'>Email</Form.Label>
          <Form.Control asChild>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className='block w-full rounded-md border-green-400 bg-green-100 p-4 focus:outline focus:outline-green-600 sm:text-sm font-medium'
              required
            />
          </Form.Control>
          <Form.Message match="valueMissing" className="text-red-500 text-sm">
            Please enter your email.
          </Form.Message>
          <Form.Message match="typeMismatch" className="text-red-500 text-sm">
            Please provide a valid email.
          </Form.Message>
        </Form.Field>

        <Form.Field name="password" className='flex flex-col gap-1'>
          <Form.Label className='block font-bold'>Password</Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md bg-green-100 p-4 focus:outline focus:outline-green-600 sm:text-sm'
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="firstName" className='flex flex-col gap-1'>
          <Form.Label className='block font-bold'>First Name</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md bg-green-100 p-4 focus:outline focus:outline-green-600 sm:text-sm'
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="lastName" className='flex flex-col gap-1'>
          <Form.Label className='block font-bold'>Last Name</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md bg-green-100 p-4 focus:outline focus:outline-green-600 sm:text-sm'
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="userName" className='flex flex-col gap-1'>
          <Form.Label className='block font-bold'>Username</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md bg-green-100 p-4 focus:outline focus:outline-green-600 sm:text-sm'
              required
            />
          </Form.Control>
        </Form.Field>

        <div className="flex flex-col gap-2">
          <Form.Submit asChild>
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </PrimaryButton>
          </Form.Submit>
        </div>
      </Form.Root>
      <SecondaryButton onClick={onToggleForm}>
        Already have an account? Sign In
      </SecondaryButton>
    </div>
  );
}

export default SignUpForm; 