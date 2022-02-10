import { useRouter } from 'next/router';
import React from 'react';

export default function UserDetails() {
  const router = useRouter();
  return <div>details about user {router.query.userId}</div>;
}
