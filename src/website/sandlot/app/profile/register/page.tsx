// app/profile/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';  // To handle the query parameters
import { title } from "@/components/primitives";
import { Button } from '@heroui/react';
import styles from './Register.module.css';

import registerPlayer from '@/app/functions/registerPlayer';
import registerTeam from '@/app/functions/registerTeam';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'player' | 'team' | null>(null);
  const [teamName, setTeamName] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [teamUsername, setTeamUsername] = useState('');
  const [preferredOffday, setPreferredOffday] = useState<number | "">("");
  const [preferredTime, setPreferredTime] = useState<number | "">("");
  const [preferredDivision, setPreferredDivision] = useState<number | "">("");
  const router = useRouter();
  const searchParams = useSearchParams();  // Access the query params
  const callbackUrl = searchParams?.get('callbackUrl') || '/profile';  // Default to '/profile' if no callbackUrl

  // NOTICE: keep these comments here they're not necessary anymore but could be helpful in the future
  // const handleRegistration = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const response = await fetch('/api/users/register', {
  //     method: 'POST',
  //     body: JSON.stringify({ email, password, accountType, teamName, name, gender }),
  //     headers: { 'Content-Type': 'application/json' },
  //   });

  //   if (response.ok) {
  //     router.push(callbackUrl);  // Redirect to the callbackUrl after successful registration
  //   } else {
  //     const data = await response.json();
  //     setError(data.error || 'Registration failed');
  //   }
  // };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // default action on submit is to redirect to callbackUrl
    if(accountType == 'player') {
      let newUser = {
        name: name,
        email: email,
        password: password,
      }
      // TODO: error checking to make sure response is OK on registration
      await registerPlayer(newUser)
    }
    else {
      let newTeam = {
        team_name: teamName,
        username: teamUsername,
        password: password,
        preferred_division: preferredDivision,
        preferred_offday: preferredOffday,
        preferred_time: preferredTime
      }
      // TODO: error checking to make sure response is OK on registration
      await registerTeam(newTeam)
    }
    router.push(callbackUrl);
  };

  const renderForm = () => {
    if (accountType === 'player') {
      return (
        <div>
          <div className={styles.inputGroup}>
            <label>Email:</label>
            <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Password:</label>
            <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Name:</label>
            <input className={styles.input} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className={`${styles.inputGroup} ${styles.gender}`}>
            <label htmlFor="gender">Gender:</label>
            <select className={styles.input} id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      );
    } else if (accountType === 'team') {
      return (
        <div>
          <div className={styles.inputGroup}>
            <label>Username:</label>
            <input className={styles.input} type="text" value={teamUsername} onChange={(e) => setTeamUsername(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Password:</label>
            <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Team Name:</label>
            <input className={styles.input} type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Preferred Division:</label>
            <select  className={styles.input} id="preferredDivision" value={preferredDivision} onChange={(e) => setPreferredDivision(parseInt(e.target.value))} required >
              <option value="-1">None</option>
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Select Preferred Offday:</label>
            <select  className={styles.input} id="preferredOffday" value={preferredOffday} onChange={(e) => setPreferredOffday(parseInt(e.target.value))} required >
              <option value="-1">None</option>
              <option value="0">Monday</option>
              <option value="1">Tuesday</option>
              <option value="2">Wednesday</option>
              <option value="3">Thursday</option>
              <option value="4">Friday</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Select Preferred Time of Day:</label>
            <select className={styles.input} id="preferredTime" value={preferredTime} onChange={(e) => setPreferredTime(parseInt(e.target.value))} required>
              <option value="0">Balanced</option>
              <option value="1">Early</option>
              <option value="2">Late</option>
            </select>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <h1 className={title()}>
      {accountType === 'player' ? 'Register Player' : accountType === 'team' ? 'Register Team' : 'Register'}
      </h1>
      <div className={styles.container}>
        <div className="centered-container">
          {error && <p className={styles.error}>{error}</p>}

          {accountType === null ? (
            <div className="form">
              <h1 className="text-xl font-semibold text-center mt-8">
                Choose an Account Type:
              </h1>
              <div className="flex space-x-4 mt-4">
                <Button onPress={() => setAccountType('player')} className="button">Player</Button>
                <Button onPress={() => setAccountType('team')} className="button">Team</Button>
              </div>
              <div className="flex justify-center mt-48">
                <Button onPress={() => router.push(callbackUrl)} className="button">Cancel</Button>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={(e) => handleRegister(e)}>

              {renderForm()}

              <div className="flex space-x-4 justify-center">
                <Button type="submit" className="button">Register</Button>
              </div>

              <div className="flex justify-center mt-4">
                <Button onPress={() => router.push(callbackUrl)} className="button">Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
