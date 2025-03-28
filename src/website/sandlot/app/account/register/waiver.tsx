import React, { use, useState } from "react";
import styles from "./Waiver.module.css";

interface WaiverProps {
    player_id?: number;
    year?: string;
    waiverTexts: string[]
    waiverInitials: string
    setWaiverInitials: any
    waiverSignature: string
    setWaiverSignature: any
}

export default function Waiver(props: WaiverProps) {

    // const waiverTexts = [
    //     "The risk of injury from the activities involved in this program is significant, including the potential for permanent paralysis and death, and while particular rules, equipment, and personal discipline may reduce this risk, the risk of serious injury does exist.",
    //     "I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS, both known and unknown, EVEN IF ARISING FROM THE NEGLIGENCE OF THE RELEASES or others, and assume full responsibility for my participation.",
    //     "I willingly agree to comply with the stated and customary terms and conditions for participants. If, however, I observe any unusual significant hazard during my presence or participation, I will remove myself from  participation and bring such to the attention of the nearest official immediately.",
    //     "I, for myself and on behalf of my heirs, assigns, personal representatives and next of kin, HEREBY RELEASE AND HOLD HARMLESS the Graduate Students Association of McMaster University their officers, officials, agents, and or employees, other participants, sponsoring agencies, sponsors, advertisers, and if applicable, owners and lessors or premises used to conduct the even (\"RELEASES\"), WITH RESPECT TO ANY AND ALL INJURY, DISABILITY, DEATH, or loss or damage to person or property, WHETHER ARISING FROM THE  NEGLIGENCE OF THE RELEASEES OR OTHERWISE, to the fullest extent permitted by law.",
    //     "I HAVE READ THIS RELEASE OF LIABILITY AND ASSUMPTION OF RISK AGREEMENT, FULLY UNDERSTAND ITS TERMS, UNDERSTAND THAT I HAVE GIVEN UP SUBSTANTIAL RIGHTS BY SIGNING IT, AND SIGN IT FREELY AND VOLUNTARILY WITHOUT ANY INDUCEMENT."
    // ];

    return (
        <div className={styles.waiver}>
            <h3 className={styles.header}>
                GSA Softball Player Waiver {props.year ? props.year : new Date().getFullYear()}
            </h3>

            <p className={styles.description}>
                This is the player participation waiver for participating in the GSA
                softball league for the {props.year ? props.year : new Date().getFullYear()} summer season. 
                By providing your initials, you acknowledge the following risks and agreements:
            </p>

            <div className={styles.inputContainer}>
                {props.waiverTexts.map((text, index) => (
                    <div key={index} className={styles.inputGroup}>
                        <label className={styles.label}>
                            {text}
                        </label>
                        <input
                            required
                            type="text"
                            value={props.waiverInitials}
                            onChange={(e) => props.setWaiverInitials(e.target.value)}
                            placeholder="Your initials"
                            className={styles.input}
                        />
                    </div>
                ))}

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Digital Signature (Full Name):</label>
                    <input
                        required
                        type="text"
                        value={props.waiverSignature}
                        onChange={(e) => props.setWaiverSignature(e.target.value)}
                        className={styles.input}
                    />
                </div>
            </div>

            <p className={styles.footnote}>
                By typing your name, you acknowledge that it will be treated as your
                digital signature per the Electronic Commerce Act, 2000, S.O. 2000, c. 17.
            </p>
        </div>
    );
}
