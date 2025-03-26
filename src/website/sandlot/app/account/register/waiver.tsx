import React, { useEffect, useState } from "react";
import styles from "./Waiver.module.css";

interface WaiverProps {
    player_id?: number;
    year?: string;
}

export default function Waiver(props: WaiverProps) {
    const [waiverInitials1, setWaiverInitials1] = useState("");
    const [waiverInitials2, setWaiverInitials2] = useState("");
    const [waiverInitials3, setWaiverInitials3] = useState("");
    const [waiverInitials4, setWaiverInitials4] = useState("");
    const [waiverInitials5, setWaiverInitials5] = useState("");
    const [waiverSignature, setWaiverSignature] = useState("");

    return (
        <div className={styles.waiver}>
            <h3>GSA Softball Player Waiver {props.year ? props.year : new Date().getFullYear()}</h3>

            <p>
                This is the player participation waiver for participating in the GSA
                softball league for the {props.year ? props.year : new Date().getFullYear()} summer season. 
                By providing your initials, you acknowledge the following risks and agreements:
            </p>

            <div className={styles.inputGroupContainer}>
                <div className={styles.inputGroup}>
                    <label>The risk of injury is significant, including paralysis or death.</label>
                    <input
                        required
                        className={styles.input}
                        type="text"
                        value={waiverInitials1}
                        onChange={(e) => setWaiverInitials1(e.target.value)}
                        placeholder="Your initials"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>I knowingly assume all risks, known and unknown.</label>
                    <input
                        required
                        className={styles.input}
                        type="text"
                        value={waiverInitials2}
                        onChange={(e) => setWaiverInitials2(e.target.value)}
                        placeholder="Your initials"
                    />
                </div>
            </div>

            <div className={styles.inputGroupContainer}>
                <div className={styles.inputGroup}>
                    <label>I agree to comply with all terms and will report hazards.</label>
                    <input
                        required
                        className={styles.input}
                        type="text"
                        value={waiverInitials3}
                        onChange={(e) => setWaiverInitials3(e.target.value)}
                        placeholder="Your initials"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>I release and hold harmless GSA, its officers, agents, and sponsors.</label>
                    <input
                        required
                        className={styles.input}
                        type="text"
                        value={waiverInitials4}
                        onChange={(e) => setWaiverInitials4(e.target.value)}
                        placeholder="Your initials"
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>I have read and understood this agreement and sign it freely.</label>
                <input
                    required
                    className={styles.input}
                    type="text"
                    value={waiverInitials5}
                    onChange={(e) => setWaiverInitials5(e.target.value)}
                    placeholder="Your initials"
                />
            </div>

            <div className={styles.inputGroup}>
                <label>Digital Signature (Full Name):</label>
                <input
                    required
                    className={styles.input}
                    type="text"
                    value={waiverSignature}
                    onChange={(e) => setWaiverSignature(e.target.value)}
                />
            </div>

            <p>
                By typing your name, you acknowledge that it will be treated as your
                digital signature per the Electronic Commerce Act, 2000, S.O. 2000, c. 17.
            </p>
        </div>
    );
}
