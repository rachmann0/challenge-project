import { getDoc, doc } from '@firebase/firestore';
import { GetServerSideProps } from 'next';
import React, { useMemo, useEffect, useContext } from 'react';
import { UserData } from './index';
import { db } from '../firebase';
import { SpinnerContext } from './_app';
import { useRouter } from 'next/router';

type PageProps = {
  userData: string;
  notFound: boolean;
};

export default function UserDetails({ userData }: PageProps) {
  const setisSpinner = useContext(SpinnerContext);
  const router = useRouter();

  const userDetails: UserData = useMemo(() => {
    const parsedData = JSON.parse(userData);
    return { ...parsedData, birthdate: new Date(parsedData.birthdate) };
  }, [userData]);
  useEffect(() => {
    setisSpinner(false);
  }, [setisSpinner]);

  return (
    <div className='dark:text-gray-200 dark:bg-slate-700 bg-white rounded-lg my-5 p-3 flex flex-col w-96 fixed'>
      <svg
        onClick={() => {
          setisSpinner(true);
          router.back();
        }}
        className='w-6 h-6 absolute top-0 left-0 m-4 cursor-pointer'
        data-darkreader-inline-fill=''
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path
          fillRule='evenodd'
          d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
          clipRule='evenodd'
        />
      </svg>
      <h3 className='font-semibold text-xl text-center mb-2'>User Details</h3>
      {/* details about user {router.query.userId} */}
      <div className='my-2'>
        <span className='text-base font-bold capitalize'>id: </span>
        {userDetails.id}
      </div>
      <div className='my-2'>
        <span className='text-base font-bold capitalize'>name: </span>
        {userDetails.name}
      </div>
      <div className='my-2'>
        <span className='text-base font-bold capitalize'>email: </span>
        {userDetails.email}
      </div>
      <div className='my-2'>
        <span className='text-base font-bold capitalize'>birthdate: </span>
        {userDetails.birthdate.toDateString()}
      </div>
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
