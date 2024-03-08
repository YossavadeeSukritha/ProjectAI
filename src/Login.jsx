import './Login.css'

function Login() {
  return (
    <>
      <div className="wrapper">
        <form className="form-signin">
          <h2 className="form-signin-heading">Login your account</h2>
          <p className='form-signin-text'>Email address</p>
          <input type="text" className="form-login" name="username" placeholder="Enter your email" required autoFocus />
          <p className='form-signin-text'>Password</p>
          <input type="password" className="form-login" name="password" placeholder="Enter your password" required />
          <button className="btn-login" type="submit">Login</button>
        </form>
      </div>
    </>
  )
}

export default Login
