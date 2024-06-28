import styles from '../../styles/settings.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { memo } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';
import ConfirmLogOut from './ConfirmLogOut';

function Navbar() {
    const router = useRouter();
    let activeState;
    if (typeof window !== 'undefined') {
        activeState = localStorage.getItem('toggle');
    }
    const [opendropdown, setdropdown] = useState(false);
    const [ownername, setownername] = useState([]);
    const [logoutPopup, setLogoutPopup] = useState(false);

    const handlelogout = () => {
        setLogoutPopup(true);
    };

    const handledashboard = () => {
        router.push({ pathname: '/dashboard-analytics' });
        // window.location.href = '/dashboard-analytics/App';
    };
 
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setownername(localStorage.getItem("ownername"));
        }
    }, []);

    let name;
    let orgnames;
    if (typeof window !== 'undefined') {
        name = localStorage.getItem("ownername");
        orgnames = localStorage.getItem("orgName");
    }
    const OrgName = orgnames;
    const ownerName = name;

    return (
        <div className={styles.container}>
            <Head>
                <title>VWeave</title>
                <meta name="description" content="Plug & Play APIs for Live & On-demand video streaming" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="images/favicon.png" />
            </Head>
            <div className={styles.containercomponents}>
                <div className={styles.uppercomponents}>
                    <ul>
                        <li className={styles.brand_logo}>
                            <Link href="/">
                                <a className={router.pathname == '/' ? styles.activate : ''}>
                                    <img src="/images/vgicon.webp" alt="icon" />
                                    <span className={styles.title}>VWeave</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a className={router.pathname == '/' || router.pathname == '/ads' ? styles.activate : ''}>
                                    <img src={router.pathname == '/' || router.pathname == '/ads' ? '/images/setting_active.svg' : '/images/setting_icon.svg'} alt="icon" />
                                    <span>ads</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings">
                                <a className={router.pathname == '/settings' ? styles.activate : ''}>
                                    <img src={router.pathname == '/settings' ? '/images/setting_active.svg' : '/images/setting_icon.svg'} alt="icon" />
                                    <span>Settings</span>
                                </a>
                            </Link>
                        </li>
                        <li>
                            <a className={styles.logout} onClick={() => handlelogout()}>
                                <img src="/images/iconfeather-log-out.png" alt="icon" />
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {logoutPopup && <ConfirmLogOut setLogoutPopup={setLogoutPopup} />}
        </div>
    );
}

export default memo(Navbar);


