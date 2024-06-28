import styles from '../../styles/model.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react';

export default function Removeuser({ setLogoutPopup }) {
  const router = useRouter()
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        setLogoutPopup(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])
  const handleDelete = () => {
   // window.localStorage.clear();
        // localStorage.removeItem('ownerLastname')
        // localStorage.removeItem('ownername')
        // localStorage.removeItem('orgName')
        // localStorage.removeItem('uuid')
        // localStorage.removeItem('userID')
        // localStorage.removeItem('Jwt-token')
        // localStorage.removeItem('envuuid')
        localStorage.removeItem('userData')
        document.cookie = 'Jwt-token=;expires=' + new Date().toUTCString()
        setLogoutPopup(true)
        window.location.href = '/signin'
  }
  return (
    <div className={`${styles.model} ${styles.remove_user_modal}`} >
      <div className={styles.model_container}>
        <div className={styles.model_main}>
          <div className={styles.model_nav}>
            <h3 className={styles.model_title}>Logout User</h3>
            <a className={styles.model_close} onClick={() => setLogoutPopup(false)}><img src="/images/close.svg" alt='icon' /> </a>
          </div>

          <div className={styles.model_removeuser}>
            <h4 className={styles.model_removeusername}>Are you sure you want to Logout?</h4>
          </div>
          <div className={styles.model_btn}>
            <a><button type="button" className={`${styles.model_canel_btn} btn btn-primary`} onClick={() => setLogoutPopup(false)}>Cancel</button></a>
            <a><button type="button" onClick={() => handleDelete()} className={`${styles.model_save_btn} btn btn-primary`} >Logout</button></a>
          </div>
        </div>
      </div>
    </div>
  )
}