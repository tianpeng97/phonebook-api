import React from 'react'

const Navbar = ({ isLog, handleIsLog, handleLogout, user }) => {
  return (
    <nav className="navbar navbar-expand navbar-light ">
      <div>
        <ul className="navbar-nav">
          {user === null ? (
            <li className="nav-item">
              <button className="nav-link nav-button" onClick={handleIsLog}>
                {isLog ? 'Register' : 'Login'}
              </button>
            </li>
          ) : (
            ''
          )}
          {user ? (
            <li className="nav-item">
              <button className="nav-link nav-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            ''
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
