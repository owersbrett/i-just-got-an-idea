'use client';
// import Placeholder from "@/components/PlaceholderComponent";
import React, { useContext, useEffect, useRef, useState } from "react";

import { Idea } from "@/common/types/idea";
import { Entry } from "@/common/types/entry";
import { Notification } from "@/common/types/notification";
import "../../styles/Common.css";
import "../../styles/TerminalInput.css";

import RevolvingIdeaAnimation from "../../components/Idea/RevolvingIdeas";
import { UserContext } from "../auth-page/UserContext";
import { EntryParser } from "@/common/entryParser";
import axios from "axios";
import { AxiosResponse } from "axios";
import authRepository from "@/repository/authRepository";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import { UserRepository } from "@/repository/userRepository";
import DismissableNotificationStack from "@/components/DismissableNotificationStack";
import { API } from "../api/api";
import { TerminalRunner } from "@/utils/terminal_runner";
const HomePage: React.FC = () => {
    const [terminalRunner, setTerminalRunner] = useState<TerminalRunner>(new TerminalRunner());
    const { user } = useContext(UserContext);
    const [terminalValue, setTerminalValue] = useState('');
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

    const [keywords, setKeywords] = useState([] as string[]);
    const [ideas, setIdeas] = useState([] as Idea[]);
    const [idea, setIdea] = useState(Idea.new('', '', [] as string[]));
    const [notifications, setNotifications] = useState([] as Notification[]);
    const [helperText, setHelperText] = useState('I just got an idea...');

    const handleKeywordSubmit = (keywordList: string[]) => {
        setKeywords(keywordList);
    };





    const handleEntrySubmitEvent = async (event: React.FormEvent) => {
        event.preventDefault();
        let terminal = terminalValue;
        terminalRunner.addInput(terminal);
        setTerminalRunner(terminalRunner);
        setTerminalValue(terminal + '\n');
        if (user) {
            terminalRunner.run(user, () => { console.log(terminal) }, terminal);
        } else {
            authenticate(terminal);
        }

    };



    useEffect(() => {
        if (user) {
            console.log("User is logged in: " + user.uid);

        } else {
            console.log("No user found");
        }
    }, [user]);

    const I_JUST_GOT_AN_IDEA = 'i-just-got-an-idea$ ';



    const onTerminalValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTerminalValue(e.target.value);
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        console.log("keydown")
        console.log(e.key);
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEntrySubmitEvent(e);
        }
    }

    const authenticate = async (input: string) => {
        if (!confirmation) {
            console.log("Verifying phone number: " + input);
            let phoneNumberValid = EntryParser.isPhoneNumberValid(input);
            if (phoneNumberValid) {
                await verifyRecaptcha(input);
            } else {
                API.postError("Invalid phone number. Please try again.", "session");
                console.error("Invalid phone number. this should create a notification");
            }
        } else {
            console.log("Verifying sms code: " + input);
            let userCredential = await authRepository.signIn(confirmation, input);
            UserRepository.getAndOrCreateUser(userCredential);
        }
    }



    function verifyRecaptcha(phoneNumber: string) {
        const recaptchaContainer = document.getElementById('recaptcha-container') ?? '';

        return new Promise((resolve, reject) => {
            const recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer, {
                size: 'normal', // Use 'compact' for a smaller widget
                callback: async (_: any) => {
                    console.log(phoneNumber);
                    let confirmation = await authRepository.sendPhoneNumberAuthCode(phoneNumber, recaptchaVerifier);
                    console.log(confirmation);
                    setConfirmation(confirmation);
                    resolve(confirmation);
                },
                'expired-callback': () => {
                    reject(new Error('reCAPTCHA verification expired'));
                },
            }, auth);

            recaptchaVerifier.render();
        });
    }

    return (
        <div className="container z-1">
            <div className="vw-100">
                <RevolvingIdeaAnimation ideas={ideas} />
            </div>


            <div className="vh-90 vw-100 bg-black" >
                <div style={{ color: 'white' }}>
                    <form className="terminal-input vh-90" onSubmit={handleEntrySubmitEvent}>

                        <textarea
                            className="terminal-text-input"
                            value={terminalValue}
                            prefix='i-just-got-an-idea$'
                            onKeyDown={onKeyDown}
                            onChange={onTerminalValueChange}
                            autoFocus
                        />

                    </form>
                </div>
                <div style={{ color: 'white' }}>

                </div>
            </div>
            <div className="absolute bottom-0 right-0 z-0">
                <DismissableNotificationStack initialNotifications={notifications} />
            </div>

            <div id="recaptcha-container"></div>
        </div>
    );
};

export default HomePage;
