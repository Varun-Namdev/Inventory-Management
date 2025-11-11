import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../DarkTheme.css';
import { validateUser } from '../../Services/LoginService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faBoxes } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // 👈 added state for invalid login

  let navigate = useNavigate();

  const checkLogin = (e) => {
    e.preventDefault();
    setLoginError(""); // reset previous error message

    validateUser(formData.username, formData.password)
      .then((response) => {
        let role = String(response.data);

        if (role === "Admin")
          navigate('/AdminMenu');
        else if (role === "Manager")
          navigate('/ManagerMenu');
        else if (role === "Vendor")
          navigate('/VendorMenu');
        else
          setLoginError("Invalid username or password may incorrect"); // 👈 show error on screen
      })
      .catch((error) => {
        console.error("Login error:", error);
        setLoginError("Something went wrong. Please try again later."); // 👈 backend/network issue
      });
  };

  const onChangeHandler = (event) => {
    event.persist();
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({ ...values, [name]: value }));
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      tempErrors.username = "User Name is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    if (isValid) {
      checkLogin(event);
    }
  };

  return (
    <div className="login-container-wrapper">
      <div className="login-container">

        <div className="logo-area">
          <FontAwesomeIcon icon={faBoxes} className="logo-icon" />
          <h1>Smartshelfx</h1>
          <p>Inventory Management System</p>
        </div>

        <div className="login-box-new">
          <h2 className="text-center">Login to your Account</h2>
          <form method="post">

            <div className="input-group-custom">
              <FontAwesomeIcon icon={faUser} />
              <input
                placeholder="Username or Email"
                name="username"
                value={formData.username}
                onChange={onChangeHandler}
              />
            </div>
            {errors.username && <p className="error-text">{errors.username}</p>}

            <div className="input-group-custom">
              <FontAwesomeIcon icon={faLock} />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={onChangeHandler}
              />
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}

            <div className="login-action-group">
              <button className='login-submit-button-new' onClick={handleValidation}>LOG IN</button>
              <button
                className='register-side-button'
                type="button"
                onClick={() => {
                  setFormData({ username: "", password: "" });
                  setErrors({});
                  setLoginError("");
                }}>
                RESET
              </button>
            </div>

            {/* 👇 Error message for wrong username/password */}
            {loginError && <p className="error-text">{loginError}</p>}

          </form>

          <div className="signup-text-custom">
            <p>Don't have an account?</p>
            <p className="login-link" onClick={() => navigate('/Register')}>Register here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
