// ? firebase
import { collection, query, orderBy, onSnapshot } from '@firebase/firestore';
import { db } from '../firebase';
// ? react
import { useState, useEffect } from 'react';
// ? components
import ListPagination from '../components/ListPagination';
// ? forms
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import DarkModeToggle from '../components/DarkModeToggle';

type UserData = {
  id: string;
  name: string;
  email: string;
  birthdate: string;
};

const Home = () => {
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
    <div className='w-screen min-h-screen bg-gradient-to-tr from-blue-300 via-cyan-300 to-blue-300 dark:from-slate-800 dark:via-blue-900 dark:to-slate-800 p-5 flex flex-col justify-start items-center text-slate-800 md:p-3 pt-12'>
      <DarkModeToggle />
      <Formik
        initialValues={{
          name: '',
          email: '',
          birthdate: '',
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
        validateOnBlur={false}
        validateOnChange={false}
        // validate={(values) => {
        //   const errors: { [name: string]: any } = {};
        //   return errors;
        // }}
        validationSchema={yup.object({
          name: yup.string().required(),
          email: yup.string().required(),
          birthdate: yup.string().required(),
        })}
      >
        {(context) => (
          <Form className='shadow-lg flex flex-col justify-center items-start max-w-md w-full bg-white dark:bg-slate-700 dark:text-white font-semibold p-3 rounded-lg'>
            <label htmlFor='name'>Name</label>
            <Field
              className='w-full'
              id='name'
              name='name'
              type='text'
              placeholder='name of user'
            />
            <p className='text-red-500 text-sm h-6 self-start'>
              <ErrorMessage name='name' />
            </p>
            <label htmlFor='email'>E-Mail</label>
            <Field
              id='email'
              name='email'
              type='text'
              placeholder='valid user e-mail'
            />
            <p className='text-red-500 text-sm h-6 self-start'>
              <ErrorMessage name='email' />
            </p>
            <label htmlFor='birthdate'>Birthdate</label>
            <Field
              id='birthdate'
              name='birthdate'
              type='text'
              placeholder='user birthdate'
            />
            <p className='text-red-500 text-sm h-6 self-start'>
              <ErrorMessage name='birthdate' />
            </p>

            <div className='flex justify-between w-full'>
              <button
                type='button'
                className='btn btn-red uppercase w-full mx-1'
                onClick={() => {
                  context.setErrors({});
                  context.resetForm();
                }}
              >
                clear form
              </button>
              <button
                type='submit'
                className='btn btn-blue uppercase w-full mx-1'
              >
                add new user
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <ListPagination
        className='flex justify-center items-center max-w-lg w-full'
        data={userData}
        getKey={(el) => el.id}
      >
        {(el, key) => (
          <div key={key} className='shadow-lg bg-white rounded p-3 my-2 w-full'>
            <div>
              <span className='text-base font-bold capitalize'>name: </span>
              {el.name}
            </div>
            <div>
              <span className='text-base font-bold capitalize'>email: </span>
              {el.email}
            </div>
            <div>
              <span className='text-base font-bold capitalize'>
                birthdate:{' '}
              </span>
              {el.birthdate}
            </div>
          </div>
        )}
      </ListPagination>
    </div>
  );
};

export default Home;
