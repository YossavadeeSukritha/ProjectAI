import { useState } from 'react';
import './Login.css'
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8081/Login', values)
      .then(response => {
        if (response.data.Status === "Success") {
          window.location.href = "/Home";
        } else {
          alert(response.data.Message)
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <>
      <div className="wrapper">
        <form className="form-signin" onSubmit={handleSubmit}>
          <h2 className="form-signin-heading">Login your account</h2>
          <p className='form-signin-text'>Email address</p>
          <input type="text" className="form-login" name="email" placeholder="Enter your email" required autoFocus onChange={handleChange} />
          <p className='form-signin-text'>Password</p>
          <input type="password" className="form-login" name="password" placeholder="Enter your password" required onChange={handleChange} />
          <button className="btn-login" type="submit">Login</button>
        </form>
      </div>
    </>
  )
}

export default Login


