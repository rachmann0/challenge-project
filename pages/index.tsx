import { collection, query, orderBy, onSnapshot } from '@firebase/firestore';
import { db } from '../firebase';
import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

type UserData = {
  name: string;
  email: string;
  id: string;
  birthdate: string;
};

const Home: NextPage = () => {
  const [userData, setuserData] = useState<UserData[]>([]);
  useEffect(() => {
    const collectionRef = collection(db, 'users');
    const q = query(collectionRef, orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setuserData(
        querySnapshot.docs.map(
          (el): UserData => ({
            id: el.id,
            name: el.data().name,
            email: el.data().email,
            // birthdate: el.data().birthdate?.toDate().getTime(),
            birthdate: el.data().birthdate?.toDate().toDateString(),
          })
        )
      );
    });
    return unsubscribe;
  }, []);

  return (
    <div className={styles.container}>
      {userData.map((el) => (
        <div key={el.id}>
          <div className='text-3xl font-bold'>{el.name}</div>
          <div>{el.email}</div>
          <div>{`birthdate: ${el.birthdate}`}</div>
        </div>
      ))}
    </div>
  );
};

export default Home;
