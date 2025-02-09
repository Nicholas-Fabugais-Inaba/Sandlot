// app/profile/signin/page.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';  // To handle the query parameters
import { title } from "@/components/primitives";
import { Button } from '@heroui/react';
import styles from './SignIn.module.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();  // Access the query params
  const callbackUrl = searchParams?.get('callbackUrl') || '/profile';  // Default to '/profile' if no callbackUrl

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,  // Prevent automatic redirect
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push(callbackUrl);  // Redirect to the page the user came from
    }
  };

  return (
    <div>
      <h1 className={title()}>Sign In</h1>
      <div className={styles.container}>
        <div className="centered-container">
          {error && <p className={styles.error}>{error}</p>}
          <form className="form" onSubmit={handleSignIn}>
            <div className={styles.inputGroup}>
              <label>Email:</label>
              <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Password:</label>
              <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex space-x-4 justify-center">
              <Button type="submit" className="button">Sign In</Button>
            </div>
          </form>
          <div className={styles.newUserContainer}>
            <p className={styles.newUserText}>New User?</p>
            <Button 
              onPress={() => router.push('/profile/register')} 
              className="button">
              Create an Account
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button 
              onPress={() => router.push(callbackUrl)}  // Redirect to the previous page (team or profile)
              className="button">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
