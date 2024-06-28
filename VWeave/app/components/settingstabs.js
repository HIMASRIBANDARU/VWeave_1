import React from "react";
import { useState, useEffect } from "react"
import styles from '../styles/tabs.module.css';
import LiveConfig from "./settings_tabs/live_config";

export default function Settings_tabs(){
    const [toggleState, setToggleState] = useState('overview');

    const toggleTab = (index) => {
        router.push({ query: { 'path': index, 'contentId': router.query.contentId } })
        setToggleState(index);
    };

    return(
        <div>
            <div className={styles.wrapper_tabs}>
                <div className={styles.bloc_tabs}>
                    <button
                        className={toggleState === 'overview' ? `${styles.tabs_item} ${styles.active_tabs}` : `${styles.tabs_item}`}
                        onClick={() => toggleTab('overview')}
                    >
                        <span>Settings</span>
                    </button>
                </div>

                <div className={styles.content_tabs_area}>
                    <div
                        className={toggleState === 'overview' ? `${styles.content_tabs} ${styles.active_content}` : `${styles.content_tabs}`}
                    >
                        {toggleState == 'overview' && <LiveConfig />}
                    </div>
                </div>
            </div>
        </div>
    );
}
