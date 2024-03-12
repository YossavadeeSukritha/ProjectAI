import { useState } from 'react';
import './Login.css'
import {useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

   const navigate = useNavigate()


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8081/Login', values)
    .then(res => {
      if(res.data.Status === "Success"){
        navigate('/Home')
      }else{
        alert(res.data.Message)
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
          <input type="text" className="form-login" name="username" placeholder="Enter your email" required autoFocus onChange={e => setValues({...values, email: e.target.value})}/>
          <p className='form-signin-text'>Password</p>
          <input type="password" className="form-login" name="password" placeholder="Enter your password" required onChange={e => setValues({...values, password: e.target.value})}/>
         
            <button className="btn-login" type="submit">Login</button>
       
        </form>
      </div>
    </>
  )
}

export default Login


