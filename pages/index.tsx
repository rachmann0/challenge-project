// ? firebase
import {
  deleteDoc,
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from '@firebase/firestore';
import { db } from '../firebase';
// ? react
import { useState, useEffect } from 'react';
// ? components
import ListPagination from '../components/ListPagination';
// ? forms
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import DarkModeToggle from '../components/DarkModeToggle';
import { usePopper } from 'react-popper';
import Tooltip from '../components/Tooltip';

type UserData = {
  id: string;
  name: string;
  email: string;
  birthdate: string;
};

const Home = () => {
  usePopper();

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
    <div className='w-screen min-h-screen bg-gradient-to-tr bg-blue-300 dark:from-slate-800 dark:to-slate-800 p-5 flex flex-col justify-start items-center text-slate-800'>
      <DarkModeToggle />
      <Formik
        initialValues={{
          name: '',
          email: '',
          birthdate: '',
        }}
        onSubmit={async (values, { resetForm }) => {
          const collectionRef = collection(db, 'users');
          let docRef;
          try {
            docRef = await addDoc(collectionRef, {
              ...values,
              birthdate: serverTimestamp(),
            });
            alert(
              `new user with name '${values.name}' and id '${docRef.id}' added successfully`
            );
          } catch (error) {
            alert(`failed to add new user with name '${values.name}'`);
          } finally {
            resetForm();
          }
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
          <Form className='shadow-lg flex flex-col justify-center items-start max-w-md w-full bg-white dark:bg-slate-700 font-semibold p-3 rounded-lg'>
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
                  // context.setErrors({});
                  context.resetForm(); // reset errors handled by resetForm
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
        className='flex flex-col justify-center items-center max-w-lg w-full'
        data={userData}
        getKey={(el) => el.id}
      >
        {(el, key) => (
          <div
            key={key}
            className='shadow-lg bg-white rounded p-3 my-2 w-full flex justify-between'
          >
            <div className='flex flex-col'>
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
            <div className='self-center'>
              <Tooltip
                handleDelete={async () => {
                  const docRef = doc(db, 'users', el.id);
                  try {
                    await deleteDoc(docRef);
                    alert(`successfully deleted user with id '${el.id}'`);
                  } catch (error) {
                    alert(`failed to delete user with id '${el.id}'`);
                  }
                }}
              />
            </div>
          </div>
        )}
      </ListPagination>
    </div>
  );
};

export default Home;
