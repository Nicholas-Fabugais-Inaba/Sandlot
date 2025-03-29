// app/account/signin/page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // To handle the query parameters
import { Button } from "@heroui/react";

import styles from "./SignIn.module.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { title } from "@/components/primitives";
import "../../Global.css";

export default function SignIn() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle the visibility state
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous error message
    const result = await signIn("credentials", {
      redirect: false, // Prevent automatic redirect
      userID,
      password,
    });

    if (result?.error) {
      console.log (result.error);
      setError("Invalid username/email or password.");
    } else {
      window.location.href = "/account"; // Full page reload to ensure a complete refresh
    }
  };

  return (
    <div>
      <div className="mt-[20px]">
        <h1 className={title()}>Sign In</h1>
      </div>
      <div className={styles.container}>
        <div className="centered-container">
          <div className="">
            {error && (
              <p className={styles.error}>
                {error}
              </p>
            )}
          </div>
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
              <div className={styles.passwordInputWrapper}>
                <input
                  required
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Change icon based on visibility */}
                </button>
              </div>
            </div>
            <div className="flex space-x-4 justify-center">
              <Button className="button" type="submit">
                Sign In
              </Button>
            </div>
          </form>
          <div className={styles.newUserContainer}>
            <p className="mt-4">
              <em>Don't have an account?</em>
            </p>
            <Button
              className="button"
              onPress={() => router.push("/account/register")}
            >
              Register
            </Button>
          </div>
          <div className="flex justify-center mt-4">
            <Button
              className="button"
              onPress={() => router.push("/account")} // Redirect to the previous page (team or account)
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}