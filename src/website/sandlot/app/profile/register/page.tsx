'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // After successful registration, redirect to the sign-in page
      router.push('/profile/signin');
    } else {
      setError('Failed to register');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleRegister}>
        <div className={styles.inputGroup}>
          <label>Email:</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password:</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles.submitButton} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
