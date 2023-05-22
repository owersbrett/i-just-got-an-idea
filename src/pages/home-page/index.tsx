'use client';
// import Placeholder from "@/components/PlaceholderComponent";
import React, { useContext, useEffect, useRef, useState } from "react";

import { Idea } from "@/common/types/idea";
import { Entry } from "@/common/types/entry";
import { Notification } from "@/common/types/notification";
import "../../styles/Common.css";
import "../../styles/TerminalInput.css";

import RevolvingIdeaAnimation from "../../components/Idea/RevolvingIdeaAnimation";
import { UserContext } from "../auth-page/UserContext";
import { EntryParser } from "@/common/entryParser";
import axios, { AxiosError } from "axios";
import { AxiosResponse } from "axios";
import authRepository from "@/repository/authRepository";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../../firebase/clientApp";
import { UserRepository } from "@/repository/userRepository";
import DismissableNotificationStack from "@/components/DismissableNotificationStack";
import { API, SuccessCallback, ErrorCallback } from "../api/api";
import { TerminalRunner } from "@/utils/terminal_runner";
import { SessionContext } from "../auth-page/SessionContext";
import { IntervalConfig } from "@/common/intervalConfig";
const HomePage: React.FC = () => {
    const [terminalRunner, setTerminalRunner] = useState<TerminalRunner>(new TerminalRunner());
    const [history, setHistory] = useState<string>("");
    const { user } = useContext(UserContext);

    const { session } = useContext(SessionContext);
    const [terminalValue, setTerminalValue] = useState('');
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

    const [keywords, setKeywords] = useState([] as string[]);
    const [ideas, setIdeas] = useState([] as Idea[]);
    const [idea, setIdea] = useState(null as Idea | null);
    const [notifications, setNotifications] = useState([] as Notification[]);
    const [helperText, setHelperText] = useState('I just got an idea...');

    const parseIdeas: SuccessCallback = (response: AxiosResponse<any>) => {
        try {
            console.log("parsing ideas")
            console.log("ideasLength: " + ideas.length);

            if (response.data) {
                let currentIdeas = response.data.ideas as Idea[];
                if (currentIdeas.length != ideas.length) {
                    console.log("ideasLength:" + ideas.length)
                    console.log("currentIdeas length:" + currentIdeas.length)
                    console.log("setting ideas")
                    setIdeas(currentIdeas);
                    console.log(ideas.length)
                    console.log(currentIdeas.length)

                }
            }
        } catch (e) {
            console.error(e)
        }
    }
    const parseIdeasFailed: ErrorCallback = (response: AxiosError<any>) => {
        console.error(response);
        if (user) {
            API.postError(user.uid, "Error parsing ideas")
        }
    }


    const fetchIdeas = async (uid: string) => {
        const pollingEndpoint = `/api/ideas?uid=${uid}`
        let response = await API.get(pollingEndpoint, "Error getting ideas: ");
        if (response.data) {
            let currentIdeas = response.data.ideas as Idea[];
            if (currentIdeas) {
                let shouldSetIdeas = currentIdeas.length != ideas.length;
                console.log("Should set ideas: " + shouldSetIdeas);
                if (shouldSetIdeas) {
                    setIdeas(currentIdeas);
                }
            }
        }

    }





    const handleEntrySubmitEvent = async (event: React.FormEvent) => {
        event.preventDefault();
        let terminal = terminalValue;
        terminalRunner.addTerminalEntry(terminal);
        setTerminalRunner(terminalRunner);
        setTerminalValue("");
        console.log("user: " + user?.uid)
        setHistory(history + "\n" + terminal.trim())
        if (user) {
            terminalRunner.run(user);
        } else {
            authenticate(terminal);
        }

    };



    const startPolling = (uid: string) => {
        fetchIdeas(uid);

        setInterval(() => fetchIdeas(uid), IntervalConfig.minute);
    }


    useEffect(() => {
        if (user) {
            terminalRunner.sessionId = session.sessionId;
            startPolling(user.uid);
        }
    }, [user]);

    const onTerminalValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTerminalValue(e.target.value);
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEntrySubmitEvent(e);
        }
    }

    const authenticate = async (input: string) => {
        if (!confirmation) {
            let phoneNumberValid = EntryParser.isPhoneNumberValid(input);
            if (phoneNumberValid) {
                await verifyRecaptcha(input);
            } else {
                API.postError("Invalid phone number. Please try again.", "session");
                console.error("Invalid phone number. this should create a notification");
            }
        } else {
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
                    let confirmation = await authRepository.sendPhoneNumberAuthCode(phoneNumber, recaptchaVerifier);
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

    let onSelectIdea = (idea: Idea | null) => {
        setIdea(idea);
        terminalRunner.update(idea);
    }


    return (
        <div className="container z-1">
            <div className="vw-100">
                <RevolvingIdeaAnimation key={"revolvingIdeaAnimation"} ideas={ideas} onSelectIdea={onSelectIdea} />
            </div>

            <div className="flex flex-row">
                <div className="vh-90 vw-50 bg-black" >

                    <form className="terminal-input vh-90 flex" onSubmit={handleEntrySubmitEvent}>
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
                <div className="vh-90 vw-50 bg-black" >

                    <form className="terminal-input vh-90 flex" onSubmit={handleEntrySubmitEvent}>
                        <textarea
                            className="terminal-text-input"
                            value={history ?? ""}
                            disabled
                            prefix='i-just-got-an-idea$'
                            onKeyDown={onKeyDown}
                            onChange={onTerminalValueChange}
                            autoFocus
                        />
                    </form>

                </div>
            </div>
            <div className="absolute bottom-0 left-0 z-0 fall-through terminal-text">
                <p>Mode: {terminalRunner.getEntryType()}</p>
            </div>
            <div className="absolute bottom-0 right-0 z-0 fall-through">
                <DismissableNotificationStack initialNotifications={notifications} />
            </div>

            <div id="recaptcha-container"></div>
        </div>
    );
};

export default HomePage;
