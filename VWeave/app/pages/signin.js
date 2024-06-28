import styles from '../styles/Login.module.css';
import { useForm } from "react-hook-form";
import Api from '../components/api/api';
import { useRouter } from 'next/router'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';
// import { errorToolTip, errorContainer } from '../components/utils/genfunctions';
// import { ToastContainer } from 'react-toastify';
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'

// const schema = yup.object().shape({
//   login: yup.string().email('Please enter valid email').required('This field is required'),
//   password: yup.string().required('This field is required')
// })
export default function Signin() {
  const [error, seterror] = useState([]);
  const [count, setCount] = useState(0);
  const [togglePassword, setTogglePassword] = useState(false);
  // const [timing,setTiming]=useState(false)
  const { register, setError, handleSubmit, setValue, formState: { errors } } = useForm();

  const router = useRouter()
  var invCode = router.query.invitecode;
  var orgname = router.query.orgName;
  var userUUID = router.query.userUUID;
  let timer
  let deadline
  let startTime
  let timing = false
  const timerFun = () => {
    deadline = 1000 * 300
    startTime = Date.now()
    // setStartTime(Date.now())
    if (timing === false) {

      localStorage.setItem('startTime', startTime)

    }

    let remaining = deadline - (Date.now() - localStorage.getItem('startTime'))
    const int = setInterval(() => {
      localStorage.setItem('remainingTime', deadline - (Date.now() - localStorage.getItem('startTime')))

      if (deadline - (Date.now() - startTime) <= 0) {
        clearInterval(int)
        localStorage.removeItem('startTime', startTime)
        localStorage.removeItem('remainingTime')
      }
    }, 1000 * 1);

    // let remaining=deadline-(Date.now() - startTime) 

    // localStorage.setItem('remainingTime',remaining)
    // console.log(remaining)
    const btn = document.querySelector('.btn')
    btn.disabled = true;
    btn.style.backgroundColor = '#2893eb';
    btn.style.cursor = 'not-allowed'

    timer = setTimeout(() => {
      setError('password', { message: '' })
      btn.disabled = false
      btn.style.backgroundColor = '#2863eb'
      btn.style.cursor = 'pointer'
      setCount(0)
      clearInterval(int)
      localStorage.removeItem('remainingTime')
      localStorage.removeItem('startTime')
      localStorage.removeItem('message')
    }, [remaining])
  }
  const onSubmit = login_details => {
    if (login_details.password.match(/^\s*$/) === null) {
      login_details.password = login_details.password.trim()
      login_details.password = btoa(login_details.password)
      let check = document.getElementById('remember')

      if (check.checked === true) {
        // console.log((login_details.password),'psw')
        // document.cookie=`email=${login_details.login}`
        // document.cookie=`pswd=${login_details.password}`
        localStorage.setItem('email', login_details.login)
        localStorage.setItem('pswd', login_details.password)
      } else {
        // document.cookie = 'email=;expires=' + new Date().toUTCString();
        // document.cookie = 'pswd=;expires=' + new Date().toUTCString();
        localStorage.removeItem('email')
        localStorage.removeItem('pswd')
      }
      Api.SignIn(login_details)
        .then(res => {
          if (res && res.data && res.data.data && res.data.status == 'Success') {
            localStorage.setItem('userData', JSON.stringify(res.data.data));
            document.cookie = `Jwt-token=${res.data.data.token}`;

            window.location.href = '/'
          }

        })
      .catch(err => {
        // errorToolTip(err.response.data.message)
        // console.log(err.response)
        // setCount(count + 1)
        // if (count == 5) {
        //   setError('password', { message: 'Too many invalid logins. To retry please wait for 5 minutes' })
        //   localStorage.setItem('message', 'Too many invalid logins. To retry please wait for 5 minutes')
        //   const btn = document.querySelector('.btn')
        //   btn.disabled = true;
        //   btn.style.backgroundColor = '#2893eb';
        //   btn.style.cursor = 'not-allowed'
        //   timerFun()

        // }
        if (err && err.response&& err.response.data.code == 400) {
          // document.cookie = 'email=;expires=' + new Date().toUTCString()
          // document.cookie = 'pswd=;expires=' + new Date().toUTCString()
          localStorage.removeItem('email')
          localStorage.removeItem('pswd')
          seterror(err.response.data.message)
          setTimeout(() => {
            seterror('')
          }, 1000 * 3);
        }
      })
    } else {
      setError('password', { message: 'This field is required' })
    }
  }

  useEffect(() => {
    // if (localStorage.getItem('message')) {
    //   setError('password', { message: localStorage.getItem('message') })
    // }
    // const mail = document.getElementById('email')
    // mail.focus()
    // //if more than one cookie is present in browser to redirect to '/' if already loggedin
    let all = document.cookie.split(';')
    all.forEach(val => {
      let value = val.split('=')[0]
      //for chrome or firefox
      if (value == 'Jwt-token' || value == ' Jwt-token') {
        router.push({
          pathname: '/'
        })
      }
    })

    // remember me
    // if(document.cookie.match('email')!==null && document.cookie.match('pswd')!==null){
    //       setValue('login',document.cookie.split(`email=`).pop().split(';')[0]);
    //       setValue('password',atob(document.cookie.split(`pswd=`).pop().split(';')[0]));     
    //       let check=document.getElementById('remember')
    //       check.checked=true
    // }
    if (localStorage.getItem('email') !== null && localStorage.getItem('pswd') !== null) {
      setValue('login', localStorage.getItem('email'));
      setValue('password', atob(localStorage.getItem('pswd')));
      let check = document.getElementById('remember')
      check.checked = true
    }


    //  incorrect credentials

    const btn = document.querySelector('.btn')
    if (localStorage.getItem('remainingTime')) {
      timing = true
      btn.disabled = true;
      btn.style.backgroundColor = '#2893eb';
      btn.style.cursor = 'not-allowed'
      timerFun()
    } else {
      btn.disabled = false
      btn.style.backgroundColor = '#2863eb'
      btn.style.cursor = 'pointer'
      setCount(0)
    }


  }, [])

  const handleTogglePassword = () => {
    setTogglePassword(!togglePassword)
  }
  return (
    <div className={styles.wrapper_signup}>
      <Head>
        <title>Videograph - Admin Portal</title>
        <meta name="description" content="Plug & Play APIs for Live &
On-demand video streaming" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="images/favicon.png" />
      </Head>
      <main className={styles.main_signup}>
        <div>
          <img src='/images/videographlogo.webp' alt="videographlogo" />
          <span className={styles.adminPortal}>Admin Portal</span>
        </div>
        <div className={styles.signup_area}>
          <h3 className={styles.signup_title}>
            Sign in into your account
          </h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className={`${styles.label} ${styles.req}`}>Email</label>
              <input
                maxLength={40}
                id="email"
                placeholder="Enter email address"
                name="login"
                className={`${styles.signup_input} form_control`}
                {...register("login", {
                  required: 'This field is required', pattern: {
                    value: /^[A-Z0-9_%+-.^*!$`~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'invalid email address'
                  }
                })}
              />
            </div>

            <p className={'validations'}>{errors.login?.message}</p>
            <div>
              <label className={`${styles.label} ${styles.req}`}>Password</label>
              <input
                id="password"
                maxLength={40}
                autoComplete='current-password'
                type={togglePassword ? "text" : "password"}
                placeholder="Enter password"
                name="password"
                className={`${styles.signup_input} form_control`}
                {...register("password", {
                  required: 'This field is required', pattern: {
                    value: /^[^\s]+(?:$|.*[^\s]+$)/,
                    message: 'Entered value cannot start/end or have only white space'
                  }
                })}
              />
              <div className={styles.pswdToggle}>
                {togglePassword ? <img onClick={() => handleTogglePassword()} src="/images/password(passwordTotext).svg" />
                  : <img onClick={() => handleTogglePassword()} src="/images/password(textTopassword).svg" />}
              </div>

              {error && !errors.password && !errors.login && <span className='error'>{error}</span>}
            </div>
            <p className={'validations'}>{errors.password?.message}</p>
            <div className={styles.rememberMe}>
              <input id="remember" type="checkbox" />
              <div className={styles.logInRem}>Remember me</div>
            </div>
            <button type='submit' className={`${styles.signup_btn} btn`} id="submitBtn">Sign in </button>
            {/* <Link href="/email"><h4 className={styles.forgotpw}>Forgot Password?</h4></Link> */}
          </form>
          {/* <h4 className={styles.already_account}>Don&#39;t have an account?</h4>
          <Link href="/signup"><a className={styles.signin_link}>Sign up</a></Link> */}
        </div>
        {/* {errorContainer()}   */}
      </main>
    </div>
  )
}
