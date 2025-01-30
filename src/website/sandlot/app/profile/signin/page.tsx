// app/profile/signin/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { title } from "@/components/primitives";
import { Button } from '@heroui/react';
import styles from './SignIn.module.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      router.push('/profile');
    } else {
      const data = await response.json();
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div>
      <h1 className={title()}>Sign In</h1>
      <div className={styles.container}>
        <div className="centered-container">
          {error && <p className={styles.error}>{error}</p>}
          <form className={styles.form} onSubmit={handleSignIn}>
            <div className={styles.inputGroup}>
              <label>Email:</label>
              <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label>Password:</label>
              <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex space-x-4 justify-center">
              <Button type="submit" className={styles.submitButton}>Sign In</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
