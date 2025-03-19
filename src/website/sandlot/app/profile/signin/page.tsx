// app/profile/signin/page.tsx

"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"; // To handle the query parameters
import { Button } from "@heroui/react";

import styles from "./SignIn.module.css";

import { title } from "@/components/primitives";

function getCallbackUrl() {
  const searchParams = useSearchParams(); // Access the query params

  return searchParams?.get("callbackUrl") || "/profile"; // Default to '/profile' if no callbackUrl
}

export default function SignIn() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false, // Prevent automatic redirect
      userID,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = getCallbackUrl(); // Full page reload to ensure a complete refresh
    }
  };

  return (
    <div>
      <h1 className={title()}>Sign In</h1>
      <div className={styles.container}>
        <div className="centered-container">
          {error && <p className={styles.error}>{error}</p>}
          <Suspense>
            <form className="form" onSubmit={handleSignIn}>
              <div className={styles.inputGroup}>
                <label>Email or Team Username:</label>
                <input
                  required
                  className={styles.input}
                  type="text"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Password:</label>
                <input
                  required
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex space-x-4 justify-center">
                <Button className="button" type="submit">
                  Sign In
                </Button>
              </div>
            </form>
          </Suspense>
          <div className={styles.newUserContainer}>
            <p className={styles.newUserText}>New User?</p>
            <Button
              className="button"
              onPress={() => router.push("/profile/register")}
            >
              Create an Account
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Suspense>
              <Button
                className="button"
                onPress={() => router.push(getCallbackUrl())} // Redirect to the previous page (team or profile)
              >
                Cancel
              </Button>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
