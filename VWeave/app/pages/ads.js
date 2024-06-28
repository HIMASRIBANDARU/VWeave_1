import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './ads.module.css';
import Layout from '../components/common/layout';

function Ads() {
  const router = useRouter();
  const [ads, setAds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAd, setCurrentAd] = useState({ title: '', creation: '', duration: '' });
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const savedAds = JSON.parse(localStorage.getItem('ads')) || [];
    setAds(savedAds);
  }, []);

  const handleCreateAd = () => {
    router.push('/create-ad');
  };

  const handleEditAd = (index) => {
    setCurrentAd(ads[index]);
    setCurrentIndex(index);
    setIsEditing(true);
  };

  const handleDeleteAd = (index) => {
    const updatedAds = ads.filter((_, i) => i !== index);
    setAds(updatedAds);
    localStorage.setItem('ads', JSON.stringify(updatedAds));
  };

  const handleSaveEdit = () => {
    const updatedAds = [...ads];
    updatedAds[currentIndex] = currentAd;
    setAds(updatedAds);
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    setIsEditing(false);
    setCurrentAd({ title: '', creation: '', duration: '' });
    setCurrentIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAd({ ...currentAd, [name]: value });
  };

  return (
    <div className={styles.Ads}>
      <div className={styles.AdsHeader}>
        <h1>Ads</h1>
        <button className={styles.createAdsButton} onClick={handleCreateAd}>
          Create Ads
        </button>
      </div>
      <div className={styles.description}>
        <p>I shall advertise for someone to go with me.</p>
      </div>
      {isEditing ? (
        <div className={styles.editForm}>
          <h2>Edit Ad</h2>
          <input
            type="text"
            name="title"
            value={currentAd.title}
            onChange={handleInputChange}
            placeholder="Ad Title"
          />
          <input
            type="text"
            name="creation"
            value={currentAd.creation}
            onChange={handleInputChange}
            placeholder="Ad Creation"
          />
          <input
            type="text"
            name="duration"
            value={currentAd.duration}
            onChange={handleInputChange}
            placeholder="Ad Duration"
          />
          <button onClick={handleSaveEdit}>Save</button>
        </div>
      ) : (
        <table className={styles.adsTable}>
          <thead>
            <tr>
              <th>Ad Title</th>
              <th>Ad Creation</th>
              <th>Ad Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad, index) => (
              <tr key={index}>
                <td>{ad.title}</td>
                <td>{ad.creation}</td>
                <td>{ad.duration}</td>
                <td>
                  <button onClick={() => handleEditAd(index)}>Edit</button>
                  <button onClick={() => handleDeleteAd(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

Ads.getLayout = function getLayout(page) {
  return (
    <Layout>
      <div className="wrapper_body">
        {page}
      </div>
    </Layout>
  );
};

export default Ads;





