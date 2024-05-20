import React, { useContext } from 'react';
import logo from '../images/addavatar.png';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <div className='navbar'>
      <div>
        <span className="logo">Viatu Chat</span>
      </div>
      <div className='user'>
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)}>Logout</button>
      </div>

    </div>
  );
}

export default Navbar;
