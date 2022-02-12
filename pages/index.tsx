// ? firebase
import {
  Timestamp,
  deleteDoc,
  updateDoc,
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
  // serverTimestamp,
  addDoc,
} from '@firebase/firestore';
import { db } from '../firebase';
// ? react
import { useState, useEffect, useMemo } from 'react';
// ? components
import ListPagination from '../components/ListPagination';
// ? forms
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import DarkModeToggle from '../components/DarkModeToggle';

import Tooltip from '../components/Tooltip';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';

type UserData = {
  id: string;
  name: string;
  email: string;
  birthdate: Date;
};

const Home = () => {
  const initialValues = {
    id: '',
    name: '',
    email: '',
    birthdate: new Date(),
  };

  const [editMode, seteditMode] = useState({
    isEditMode: false,
    initialValues: {
      id: '',
      name: '',
      email: '',
      birthdate: new Date(),
    },
  });

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
            birthdate: el.data().birthdate?.toDate(),
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
        enableReinitialize // reinitialize also resets errors. no need to 'resetForm'
        initialValues={editMode.initialValues}
        onSubmit={async (values, { resetForm }) => {
          console.log(values.birthdate);
          // ! update
          if (editMode.isEditMode) {
            const docRef = doc(db, 'users', values.id);
            try {
              await updateDoc(docRef, {
                ...values,
                birthdate: Timestamp.fromDate(values.birthdate),
              });
              toast.success(`successfully updated user with id '${values.id}'`);
            } catch (error) {
              toast.error(`failed to updated user with id '${values.id}'`);
            } finally {
              seteditMode({
                isEditMode: false,
                initialValues,
              });
              return;
            }
          }
          // ! create
          const collectionRef = collection(db, 'users');
          let docRef;
          try {
            docRef = await addDoc(collectionRef, {
              ...values,
              birthdate: Timestamp.fromDate(values.birthdate),
            });
            toast.success(
              `new user with name '${values.name}' and id '${docRef.id}' added successfully`
            );
          } catch (error) {
            toast.error(`failed to add new user with name '${values.name}'`);
          } finally {
            seteditMode({
              isEditMode: false,
              initialValues,
            });
          }
        }}
        validateOnBlur={false}
        validateOnChange={false}
        // validate={(values) => {
        //   const errors: { [name: string]: any } = {};
        //   return errors;
        // }}
        validationSchema={yup.object({
          name: yup.string().required().min(3),
          email: yup.string().required().email('must be a valid email'),
          // birthdate: yup.string().required(),
          birthdate: yup
            .date()
            .required()
            .max(new Date(), `you can't be born in the future`),
        })}
      >
        {(context) => (
          <>
            <Form className='shadow-lg flex flex-col justify-center items-start max-w-md w-full bg-white dark:bg-slate-700 font-semibold p-3 rounded-lg my-3'>
              <label htmlFor='name'>Name</label>
              <Field
                className='w-full p-1'
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
                className='w-full p-1'
                id='email'
                name='email'
                type='text'
                placeholder='valid user e-mail'
              />
              <p className='text-red-500 text-sm h-6 self-start'>
                <ErrorMessage name='email' />
              </p>
              <label htmlFor='birthdate'>Birthdate</label>
              <DatePicker
                className='w-full p-1'
                selected={context.values.birthdate}
                onChange={(date: Date) => {
                  context.setFieldValue('birthdate', date);
                }}
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
                    if (!editMode.isEditMode) {
                      context.resetForm(); // reset errors handled by resetForm
                      return;
                    }
                    seteditMode({ isEditMode: false, initialValues });
                  }}
                >
                  {editMode.isEditMode ? 'cancel edit' : 'clear form'}
                </button>
                <button
                  type='submit'
                  className='btn btn-blue uppercase w-full mx-1'
                >
                  {editMode.isEditMode ? 'confirm edit' : 'add new user'}
                </button>
              </div>
            </Form>

            <ListPagination
              className='flex flex-col justify-center items-center max-w-lg w-full'
              data={userData}
              getKey={(el) => el.id}
            >
              {(el, key) => (
                <div
                  key={key}
                  className={`rounded p-3 my-2 w-full flex justify-between ${
                    el.id === editMode.initialValues.id
                      ? 'bg-gray-300'
                      : 'bg-white shadow-lg'
                  }`}
                >
                  <div className='flex flex-col'>
                    <div>
                      <span className='text-base font-bold capitalize'>
                        name:{' '}
                      </span>
                      {el.name}
                    </div>
                    <div>
                      <span className='text-base font-bold capitalize'>
                        email:{' '}
                      </span>
                      {el.email}
                    </div>
                    <div>
                      <span className='text-base font-bold capitalize'>
                        birthdate:{' '}
                      </span>
                      {el.birthdate.toDateString()}
                    </div>
                  </div>
                  <div className='self-center'>
                    <Tooltip
                      handleDelete={async () => {
                        const docRef = doc(db, 'users', el.id);
                        try {
                          await deleteDoc(docRef);
                          toast.success(
                            `successfully deleted user with id '${el.id}'`
                          );
                        } catch (error) {
                          toast.error(
                            `failed to delete user with id '${el.id}'`
                          );
                        }
                      }}
                      handleEdit={async () => {
                        seteditMode({ isEditMode: true, initialValues: el });
                      }}
                    />
                  </div>
                </div>
              )}
            </ListPagination>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Home;
