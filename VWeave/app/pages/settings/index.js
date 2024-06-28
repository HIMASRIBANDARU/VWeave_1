
import styles from '../../styles/analytics_tabs.module.css'

import Layout from '../../components/common/layout'
import Settings_tabs from '../../components/settingstabs'

import { useEffect, useState, createContext, useRef } from 'react';


import { useRouter } from 'next/router';
export default function Settings_index() {
    const router = useRouter();
    const [LoggedInAs, setLoggedInAs] = useState([]);
   

    useEffect(() => {
        const handleBackNavigation = () => {
            router.back();
        };
        window.addEventListener('popstate', handleBackNavigation);
        return () => {
            window.removeEventListener('popstate', handleBackNavigation);
        };
    }, [router]);
    useEffect(() => {
        localStorage.getItem('userData') && setLoggedInAs(JSON.parse(localStorage.getItem('userData')).email);
        
    }, []);
    const loggedInAs = () => {
        return (
          <div className="loggedInWrapper">
            {/* <div className="container"> */}
              <div className="loggedInDetails">
                <h4>Logged in as</h4>
                <h3 >{LoggedInAs}</h3>
              </div>
            {/* </div> */}
          </div>
        )
      }
   

    
    return (
        <>
         {loggedInAs()}
            <div className={styles.container} >
                
               
                <div className="container"  >
                    <div className={styles.settings}>
                        <div className={styles.padding}>

                            <div className={styles.header} >
                                <h2>
                                Settings
                                </h2>                                
                            </div>

                            <div>
                                <Settings_tabs />
                            </div>

                        </div>
                       
                    </div>

                </div>
            </div>
            </>
        )
    }

Settings_index.getLayout = function getLayout(page) {
    return (
        <Layout>
            
            <div className="wrapper_body">

                {page}

            </div>
        </Layout>
    )
};
