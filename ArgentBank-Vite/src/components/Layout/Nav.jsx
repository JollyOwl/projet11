import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import Logo from '../UI/Logo';
import SecondaryButton from '../UI/SecondaryButton';
import Username from '../UI/Username';
import { Cog6ToothIcon, ArrowLeftStartOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import UserSettingsDialog from '../Auth/UserSettingsDialog';

function Nav() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-green-100 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <Logo />

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && (
            <>
              <Username username={user?.userName} />
              <UserSettingsDialog
                trigger={
                  <SecondaryButton>
                    <div className="flex items-center gap-1">
                      <Cog6ToothIcon className="w-5 h-5" />
                      <span className="text-sm">Settings</span>
                    </div>
                  </SecondaryButton>
                }
                dialogTitle="User Settings"
              />
              <SecondaryButton onClick={() => dispatch(logout())}>
                <div className="flex items-center gap-1">
                  <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                  <span className="text-sm">Log Out</span>
                </div>
              </SecondaryButton>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu content */}
      {isMenuOpen && isLoggedIn && (
        <div className="mt-4 flex flex-col gap-3 md:hidden">
          <Username username={user?.userName} />
          <UserSettingsDialog
            trigger={
              <SecondaryButton className="w-full justify-start">
                <div className="flex items-center gap-1">
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span className="text-sm">Settings</span>
                </div>
              </SecondaryButton>
            }
            dialogTitle="User Settings"
          />
          <SecondaryButton onClick={() => dispatch(logout())} className="w-full justify-start">
            <div className="flex items-center gap-1">
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              <span className="text-sm">Log Out</span>
            </div>
          </SecondaryButton>
        </div>
      )}
    </nav>
  );
}

export default Nav;
