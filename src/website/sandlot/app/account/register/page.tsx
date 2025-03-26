// app/account/register/page.tsx

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // To handle the query parameters
import { Button } from "@heroui/react";
import Waiver from "@/app/account/register/waiver"

import styles from "./Register.module.css";

import { title } from "@/components/primitives";
import registerPlayer from "@/app/functions/registerPlayer";
import registerTeam from "@/app/functions/registerTeam";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"player" | "team" | null>(
    null,
  );
  const [teamName, setTeamName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [teamUsername, setTeamUsername] = useState("");
  const [preferredOffday, setPreferredOffday] = useState<number>(0); // defaulted to 0 instead of  || "" because it was causing typing problems in the backend
  const [preferredTime, setPreferredTime] = useState<number>(0);
  const [preferredDivision, setPreferredDivision] = useState<number>(0);
  
  const [fieldsFilled, setFeildsFilled] = useState<number>(0);
  const [showWaiver, setShowWaiver] = useState<boolean>(false);
  const router = useRouter();


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      if (accountType === "player") {
        const newUser = {
          first_name: firstname,
          last_name: lastname,
          email: email,
          password: password,
          gender: gender,
        };

        await registerPlayer(newUser);
      } else {
        const newTeam = {
          team_name: teamName,
          username: teamUsername,
          password: password,
          preferred_division: preferredDivision,
          preferred_offday: preferredOffday,
          preferred_time: preferredTime,
        };

        await registerTeam(newTeam);
      }

      // Automatically sign in the user after successful registration
      // setTimeout is used to wait for the db to be populated with the registration information before attempting retrieve the information for signIn
      setTimeout(async () => {
        const result = await signIn("credentials", {
          redirect: false, // Prevent automatic redirect
          userID: accountType === "player" ? email : teamUsername,
          password: password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          window.location.href = "/account"; // Full page reload to ensure a complete refresh
        }
      }, 1000)
    } catch (error) {
      if (error instanceof Error) {
        setError(
          (error as any).response?.data?.detail || "Registration failed",
        );
      } else {
        setError("Registration failed");
      }
    }
  };

  const renderForm = () => {
    if (accountType === "player" && !showWaiver) {
      return (
        <div>
          <div className={styles.inputGroup}>
            <label>First Name:</label>
            <input
              required
              className={styles.input}
              type="text"
              value={firstname}
              onChange={(e) => {
                setFirstName(e.target.value)
                setFeildsFilled(fieldsFilled + 1)
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Last Name:</label>
            <input
              required
              className={styles.input}
              type="text"
              value={lastname}
              onChange={(e) => {
                setLastName(e.target.value)
                setFeildsFilled(fieldsFilled + 1)
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email:</label>
            <input
              required
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setFeildsFilled(fieldsFilled + 1)
              }}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password:</label>
            <input
              required
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFeildsFilled(fieldsFilled + 1)
              }}
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.gender}`}>
            <label htmlFor="gender">Gender:</label>
            <select
              required
              className={styles.input}
              id="gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value)
                setFeildsFilled(fieldsFilled + 1)
              }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      );
    } else if (accountType === "player" && showWaiver) {
      return (
        <Waiver/>
      )
    } else if (accountType === "team") {
      return (
        <div>
          <div className={styles.inputGroup}>
            <label>Username:</label>
            <input
              required
              className={styles.input}
              type="text"
              value={teamUsername}
              onChange={(e) => setTeamUsername(e.target.value)}
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

          <div className={styles.inputGroup}>
            <label>Team Name:</label>
            <input
              required
              className={styles.input}
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Preferred Division:</label>
            <select
              required
              className={styles.input}
              id="preferredDivision"
              value={preferredDivision}
              onChange={(e) => setPreferredDivision(parseInt(e.target.value))}
            >
              <option value="-1">None</option>
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Select Preferred Offday:</label>
            <select
              required
              className={styles.input}
              id="preferredOffday"
              value={preferredOffday}
              onChange={(e) => setPreferredOffday(parseInt(e.target.value))}
            >
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
            <select
              required
              className={styles.input}
              id="preferredTime"
              value={preferredTime}
              onChange={(e) => setPreferredTime(parseInt(e.target.value))}
            >
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
        {accountType === "player"
          ? "Register Player"
          : accountType === "team"
            ? "Register Team"
            : "Register"}
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
                <Button
                  className="button"
                  onPress={() => setAccountType("player")}
                >
                  Player
                </Button>
                <Button
                  className="button"
                  onPress={() => setAccountType("team")}
                >
                  Team
                </Button>
              </div>
              <div className="flex justify-center mt-48">
                <Button
                  className="button"
                  onPress={() => router.push("/account")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={(e) => handleRegister(e)}>
              {renderForm()}

              <div className="flex space-x-4 justify-center">
                {showWaiver ? (
                  <Button className="button" type="submit">
                    Register
                  </Button>
                ) : (
                  <Button className="button" isDisabled={fieldsFilled < 5} onPress={() => setShowWaiver(true)}>
                    Next
                  </Button>
                )}
              </div>

              <div className="flex space-x-4 justify-center mt-4">
                <Button
                  className="button"
                  onPress={() => setAccountType(null)}
                >
                  Back
                </Button>
                <Button
                  className="button"
                  onPress={() => router.push("/account")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
