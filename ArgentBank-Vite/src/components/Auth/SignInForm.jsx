import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import * as Form from '@radix-ui/react-form';
import PrimaryButton from '../UI/PrimaryButton';
import SecondaryButton from '../UI/SecondaryButton';

function SignInForm({ onToggleForm }) {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div>
     <Form.Root onSubmit={handleSubmit} className='flex flex-col gap-6 max-w-sm mx-auto p-4 rounded-md border-2 border-green-600 my-8'>
      <h2 className='text-2xl font-bold'>Sign In</h2>
      {error && <p className="text-red-500">{error}</p>}
      <Form.Field name="email" className='flex flex-col gap-1'>
        <Form.Label className='block font-bold'>Email</Form.Label>
        <Form.Control asChild>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-1 block w-full rounded-md bg-green-100 p-4 focus:outline focus:outline-green-600 sm:text-sm'
            required
          />
        </Form.Control>
      </Form.Field>
      <div className="flex flex-col gap-1">
        <Form.Submit asChild>
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </PrimaryButton>
        </Form.Submit>
      
      </div>
    </Form.Root>
    <SecondaryButton onClick={onToggleForm}>
          Don't have an account? Sign Up
    </SecondaryButton>
    </div>

  );
} 

export default SignInForm; 