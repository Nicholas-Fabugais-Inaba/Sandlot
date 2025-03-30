// app/account/register/page.tsx

"use client";

import { useState, useEffect, use } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // To handle the query parameters
import { Button, Spinner } from "@heroui/react";
import Waiver from "@/app/account/register/waiver"

import styles from "./Register.module.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { title } from "@/components/primitives";
import registerPlayer from "@/app/functions/registerPlayer";
import registerTeam from "@/app/functions/registerTeam";


// waiver imports 
import createWaiver from "@/app/functions/createWaiver";
import getPlayer from "@/app/functions/getPlayer";
import getWaiverFormatByYear from "@/app/functions/getWaiverFormatByYear";
import getWaiverEnabled from "@/app/functions/getWaiverEnabled";

export default function Register() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<"player" | "team" | null>(
    null,
  );
  const [teamName, setTeamName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    username?: string;
    general?: string;
  }>({});
  const [teamUsername, setTeamUsername] = useState("");
  const [preferredOffday, setPreferredOffday] = useState<number>(0); // defaulted to 0 instead of  || "" because it was causing typing problems in the backend
  const [preferredTime, setPreferredTime] = useState<number>(0);
  const [preferredDivision, setPreferredDivision] = useState<number>(0);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [fieldsFilled, setFieldsFilled] = useState<number>(0);
  const [showWaiver, setShowWaiver] = useState<boolean>(false);  
  const router = useRouter();

  // waiver sub-component state
//   const [waiverTexts, setWaiverTexts] = useState<string[]>([
//     "The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis and death, and while particular rules, equipment, and personal discipline may reduce this risk, the risk of serious injury does exist.",
//     "I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and unknown, EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASES or others, and assume full responsibility for my participation.",
//     "I willingly agree to comply with the stated and customary terms and conditions for participants. If, however, I observe any unusual significant hazard during my presence or participation, I will remove myself from  participation and bring such to the attention of the nearest official immediately.",
//     "I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin, HEREBY RELEASE AND HOLD HARMLESS the Graduate Students Association of McMaster University their officers, officials, agents, and or employees, other participants, sponsoring agencies, sponsors, advertisers, and if applicable, owners and lessors or premises used to conduct the even (\"RELEASES\"), WITH RESPECT TO ANY AND ALL INJURY, DISABILITY, DEATH, or loss or damage to person or property, WHETHER ARISING FROM THE  NEGLIGENCE OF THE RELEASEES OR OTHERWISE, to the fullest extent permitted by law.",
//     "I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT."
// ])
  const [waiverTitle, setWaiverTitle] = useState("")
  const [waiverTexts, setWaiverTexts] = useState<string[]>([])
  const [waiverFooter, setWaiverFooter] = useState("")
  const [waiverInitials, setWaiverInitials] = useState("");
  const [waiverSignature, setWaiverSignature] = useState("");
  const [waiverEnabled, setWaiverEnabled] = useState<boolean>();

  // const [waiverState, setWaiverState] = useState(true);

  interface WaiverFormat {
    id: number;
    year: number
    index: number;
    text: string;
  }

  useEffect(() => {
    const filledCount = [firstname, lastname, email, confirmEmail, password, confirmPassword, gender, teamUsername, teamName].filter(Boolean).length;
    setFieldsFilled(filledCount);
  }, [firstname, lastname, email, confirmEmail, password, confirmPassword, gender, teamUsername, teamName]);

  useEffect(() => {
    const fetchWaiverFormat = async () => {
      try {
        const currentYear = String(new Date().getFullYear());
        const data = await getWaiverFormatByYear({ year: currentYear });
        
        if (!data) {
          console.log('No waiver format found for current year');
          return;
        }

        const waiverFormat: WaiverFormat[] = data as WaiverFormat[];
        
        if (!Array.isArray(waiverFormat) || waiverFormat.length === 0) {
          console.log('Invalid waiver format data');
          return;
        }

        // Sort the waiver format by index to ensure the order is correct
        waiverFormat.sort((a, b) => a.index - b.index);
        
        // Set the first item's text as the waiver title
        setWaiverTitle(waiverFormat[0]?.text || 'Default Waiver Title');
        
        // Extract the remaining texts (excluding the first and last items)
        const formattedTexts = waiverFormat.slice(1, -1).map(item => item.text);
        setWaiverTexts(formattedTexts);
        
        // Set the last item's text as the waiver footer
        setWaiverFooter(waiverFormat[waiverFormat.length - 1]?.text || '');
          
      } catch (error: any) {
        console.error("Error fetching waiver format:", error?.message || error);
        // Set default values if fetch fails
        setWaiverTitle('GSA Softball Player Waiver');
        setWaiverTexts([
          'Default waiver text. Please try again later.',
          'Contact administrator if problem persists.'
        ]);
        setWaiverFooter('');
      }
    };

    // const fetchWaiverEnabled = async () => {
    //   try {
    //     const data = await getWaiverEnabled();
    //     setWaiverState(!!data); // Convert to boolean
    //   }
    //   catch (error: any) {
    //     console.error("Error fetching waiver state:", error?.message || error);
    //     setWaiverState(true); // Default to enabled if fetch fails
    //   }
    // };      
    
    // Wrap in try-catch to prevent unhandled promise rejections
    // const initWaiver = async () => {
    //   try {
    //       await fetchWaiverEnabled();
    //       if (waiverState) {
    //         await fetchWaiverFormat();
    //       }
    //   } catch (error: any) {
    //     console.error("Error initializing waiver:", error?.message || error);
    //   }
    // };

      const fetchWaiverEnabled = async () => {
        const enabled = await getWaiverEnabled();
        setWaiverEnabled(enabled.waiver_enabled);
        if (enabled.waiver_enabled) {
          await fetchWaiverFormat();
        }
      };

      fetchWaiverEnabled();
    }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle the visibility state
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState); // Toggle the visibility state
  };

  const validateEmail = (email: string) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);  };

  const validateUsername = (username: string) => {
    return /^.{4,20}$/.test(username); // Any characters, 4-20 chars
  };  
  
  const validateForm = () => {
    const newErrors: typeof errors = {};
  
    // Common validations  
    if (password !== confirmPassword) {
      newErrors.password = "Passwords do not match";
    }

    // Team-specific validations
    if (accountType === "team") {
      if (!validateUsername(teamUsername)) {
        newErrors.username = "Username must be 4-20 characters long";
      }
    }
  
    // Player-specific validations
    if (accountType === "player") {
      // Add any player-specific validations here
      if (!validateEmail(email)) {
        newErrors.email = "Invalid email format";
      }
      if (!firstname.trim()) {
        newErrors.username = "First name is required";
      }
      if (!lastname.trim()) {
        newErrors.username = "Last name is required";
      }
      if (!gender) {
        newErrors.username = "Gender is required";
      }
      if (email !== confirmEmail) {
        newErrors.email = "Emails do not match";
      }
    
    }
  
    setErrors(newErrors);
    console.log(newErrors)
    return Object.keys(newErrors).length === 0;
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    

    if (!validateForm()) {
      return;
    }

    console.log("HEREEEEEEEEE")
    setIsRegistering(true);

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
        setTimeout(async () => {
          const player = await getPlayer({ email: email })

          if (waiverEnabled) {
            const completedWaiver = {
              player_id: player.id,
              signature: waiverSignature,
              initials: waiverInitials,
              year: String(new Date().getFullYear())
            }
          await createWaiver(completedWaiver)
          }
        }, )
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
          setErrors({
            general: (result.error as any).response?.data?.detail || "Registration failed"
          });
          setIsRegistering(false);
        } else {
          if(accountType == "player") {
            window.location.href = "/join-a-team"; // Full page reload to ensure a complete refresh
          }
          else {
            window.location.href = "/team"
          }
          
        }
      }, 1000)
    } catch (error) {
      setErrors({
        general: (error as any).response?.data?.detail || "Registration failed"
      });
      setIsRegistering(false);
    }
  };

  const renderForm = () => {
    if (accountType === "player" && !showWaiver) {
      return (
        <div>
          <div className={styles.errorContainer}>
            {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>

          {/* First Name & Last Name in One Row */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>First Name</label>
              <input
                required
                className={styles.input}
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Last Name</label>
              <input
                required
                className={styles.input}
                type="text"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email & Confirm Email in One Row */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                required
                className={`${styles.input} ${errors.email ? styles.invalid : ''}`}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  const newErrors = { ...errors };
                  delete newErrors.email;
                  setErrors(newErrors);
                }}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Email</label>
              <input
                required
                className={`${styles.input} ${errors.email ? styles.invalid : ''}`}
                type="email"
                value={confirmEmail}
                onChange={(e) => {
                  setConfirmEmail(e.target.value);
                  const newErrors = { ...errors };
                  delete newErrors.email;
                  setErrors(newErrors);
                }}
              />
            </div>
          </div>

          {/* Password & Confirm Password in One Row */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  required
                  className={`${styles.input} ${errors.password ? styles.invalid : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    const newErrors = { ...errors };
                    delete newErrors.password;
                    setErrors(newErrors);
                  }}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  required
                  className={`${styles.input} ${errors.password ? styles.invalid : ''}`}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    const newErrors = { ...errors };
                    delete newErrors.password;
                    setErrors(newErrors);
                  }}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className={`${styles.inputGroup} ${styles.gender} ${styles.rowSingle}`}>
            <label htmlFor="gender">Gender</label>
            <select
              required
              className={styles.input}
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer">Prefer not to say</option>
            </select>
          </div>
        </div>

      );
    } else if (accountType === "player" && showWaiver) {
      return (
        <Waiver 
          waiverTitle={waiverTitle}
          waiverTexts={waiverTexts} 
          waiverFooter={waiverFooter}
          waiverInitials={waiverInitials} 
          setWaiverInitials={setWaiverInitials} 
          waiverSignature={waiverSignature} 
          setWaiverSignature={setWaiverSignature}
        />
      )
    } else if (accountType === "team") {
      return (
        
        <div>
          <div className={styles.errorContainer}>
            {errors.username && <p className={styles.errorMessage}>{errors.username}</p>}
            {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Team Name</label>
              <input
                required
                className={styles.input}
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Username</label>
              <div className={styles.inputWithTooltip}>
                <input
                  required
                  className={`${styles.input} ${errors.username ? styles.invalid : ''}`}
                  type="text"
                  value={teamUsername}
                  onChange={(e) => {
                    setTeamUsername(e.target.value);
                    const newErrors = {...errors};
                    delete newErrors.username;
                    setErrors(newErrors);
                  }}
                />
                <span 
                  className={styles.tooltipIcon} 
                >
                  ⓘ
                  <span className={styles.tooltipText}>
                    This is the username for the team account. <br></br> Username must be 4-20 characters long.
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  required
                  className={`${styles.input} ${errors.password ? styles.invalid : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear password error when typing
                    const newErrors = {...errors};
                    delete newErrors.password;
                    setErrors(newErrors);
                  }}
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

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <div className={styles.passwordInputWrapper}>
                <input
                  required
                  className={`${styles.input} ${errors.password ? styles.invalid : ''}`}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    // Clear password error when typing
                    const newErrors = {...errors};
                    delete newErrors.password;
                    setErrors(newErrors);
                  }}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Change icon based on visibility */}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Preferred Division</label>
              <select
                required
                className={styles.input}
                id="preferredDivision"
                value={preferredDivision}
                onChange={(e) => setPreferredDivision(parseInt(e.target.value))}
              >
                <option value="-1">None</option>
                <option value="1">A</option>
                <option value="2">B</option>
                <option value="3">C</option>
                <option value="4">D</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Preferred Offday</label>
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
          </div>

          <div className={`${styles.inputGroup} ${styles.rowSingle}`}>
            <label>Preferred Time of Day</label>
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
      <div className="mt-[20px]">
        <h1 className={title()}>
          {accountType === "player"
            ? "Register Player"
            : accountType === "team"
              ? "Register Team"
              : "Register"}
        </h1>
      </div>
      <div className={styles.container}>
        <div className="centered-container">
          {isRegistering ? (
            <div className="flex justify-center items-center h-full min-h-[400px]">
              <Spinner label="Creating your account..." size="lg" />
            </div>
          ) : (
            <>
              {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
              {accountType === null ? (
                <div className="form">
                  <h1 className="text-xl font-semibold text-center mt-8">
                    Choose an Account Type
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
                    {showWaiver || accountType == "team" ? (
                      <Button className="button" type="submit" isDisabled={fieldsFilled < 3}>
                        Register
                      </Button>
                      ) : waiverEnabled ? (
                        <Button
                          className="button"
                          isDisabled={fieldsFilled < 7}
                          onPress={() => {
                            // Replace the existing validation with a more comprehensive check
                            const newErrors: typeof errors = {};
                            
                            if (!validateEmail(email)) {
                              newErrors.email = "Invalid email format";
                            }

                            if (password !== confirmPassword) {
                              newErrors.password = "Passwords do not match";
                            }

                            if (email !== confirmEmail) {
                              newErrors.email = "Emails do not match";
                            }                  

                            // If there are any errors, set them and prevent proceeding
                            if (Object.keys(newErrors).length > 0) {
                              setErrors(newErrors);
                              return;
                            }
                            
                            // If no errors, proceed to waiver
                            setShowWaiver(true);
                            
                          }}
                        >
                          Next
                        </Button>
                      ) : (                      
                      <Button
                        className="button"
                        type="submit"
                        isDisabled={fieldsFilled < 7}
                        onPress={() => {
                          // Replace the existing validation with a more comprehensive check
                          const newErrors: typeof errors = {};
                          
                          if (!validateEmail(email)) {
                            newErrors.email = "Invalid email format";
                          }

                          if (password !== confirmPassword) {
                            newErrors.password = "Passwords do not match";
                          }

                          if (email !== confirmEmail) {
                            newErrors.email = "Emails do not match";
                          }                  

                          // If there are any errors, set them and prevent proceeding
                          if (Object.keys(newErrors).length > 0) {
                            setErrors(newErrors);
                            return;
                          }
                          
                          
                        }}
                      >
                        Register
                      </Button>)
                    }
                  </div>

                  <div className="flex space-x-4 justify-center mt-4">
                    <Button
                      className="button"
                      onPress={() => {
                        if (showWaiver && accountType === "player") {
                          setShowWaiver(false);
                        } else {
                          setAccountType(null);
                        }
                      }}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
