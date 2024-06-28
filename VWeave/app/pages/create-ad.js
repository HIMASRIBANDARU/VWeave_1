import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/create-ad.module.css';

export default function CreateAd() {
  const router = useRouter();
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdCreation, setNewAdCreation] = useState('');
  const [newAdDuration, setNewAdDuration] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newAd = {
      title: newAdTitle,
      creation: newAdCreation,
      duration: newAdDuration,
    };

    let ads = JSON.parse(localStorage.getItem('ads')) || [];
    ads.push(newAd);
    localStorage.setItem('ads', JSON.stringify(ads));

    router.push('/ads');
  };

  const handleClose = () => {
    router.push('/ads');
  };

  return (
    <div className={styles.container}>
      <div className={styles.createAd}>
        <button className={styles.closeButton} onClick={handleClose}>X</button>
        <h2>Create Ad</h2>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="adTitle">Ad Title</label>
            <input
              type="text"
              id="adTitle"
              value={newAdTitle}
              onChange={(e) => setNewAdTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="adCreation">Ad Creation</label>
            <input
              type="text"
              id="adCreation"
              value={newAdCreation}
              onChange={(e) => setNewAdCreation(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="adDuration">Ad Duration</label>
            <input
              type="text"
              id="adDuration"
              value={newAdDuration}
              onChange={(e) => setNewAdDuration(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </div>
  );
}




