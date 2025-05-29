import React from 'react';
import logo from '../../img/ArgentBankLogo.svg';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" >
      <img
        className="w-58"
        src={logo}
        alt="Argent Bank Logo"
      />
    </Link>
  );
}