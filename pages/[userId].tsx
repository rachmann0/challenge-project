import { getDoc, doc } from '@firebase/firestore';
import { GetServerSideProps } from 'next';
import React, { useMemo } from 'react';
import { UserData } from './index';
import { db } from '../firebase';

type PageProps = {
  userData: string;
  notFound: boolean;
};

export default function UserDetails({ userData }: PageProps) {
  const userDetails: UserData = useMemo(() => {
    const parsedData = JSON.parse(userData);
    return { ...parsedData, birthdate: new Date(parsedData.birthdate) };
  }, [userData]);
  // const router = useRouter();

  return (
    <div className='dark:text-gray-200 dark:bg-slate-700 bg-white rounded-lg my-5 p-3'>
      {/* details about user {router.query.userId} */}
      <div>{userDetails.id}</div>
      <div>{userDetails.name}</div>
      <div>{userDetails.email}</div>
      <div>{userDetails.birthdate.toDateString()}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const id: string = context.query.userId as string;

  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  const data: PageProps = {
    userData: JSON.stringify({
      ...docSnap.data(),
      birthdate: docSnap.data()?.birthdate.toDate(),
    }),
    notFound: false,
  };

  if (!docSnap.exists()) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...data,
    },
  };
};
