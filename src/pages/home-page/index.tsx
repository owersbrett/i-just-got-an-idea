'use client';
// import Placeholder from "@/components/PlaceholderComponent";
import React, { useContext, useEffect, useRef, useState } from "react";
import EvolvingIdeaAnimation from "./EvolvingIdeaAnimation";
import { Entry, Idea, Notification, User } from "@/common/types";
import "../../styles/Common.css";
import "../../styles/TerminalInput.css";
import DismissableNotificationStack from "./DismissableNotificationStack";
import RevolvingIdeaAnimation from "./RevolvingIdeas";
import { UserContext } from "../auth-page/UserContext";
import { EntryParser } from "@/common/entryParser";
import axios from "axios";
import authRepository from "@/repository/authRepository";
import { ConfirmationResult } from "firebase/auth";
const HomePage: React.FC = () => {
    const { user } = useContext(UserContext);
    const [terminalValue, setTerminalValue] = useState('');
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

    const [keywords, setKeywords] = useState([] as string[]);
    const [entry, setEntry] = useState(Entry.new('', '', ''));
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
        setTerminalValue('');

        if (terminalValue.length > 0) {
            if (user) {
                if (idea.isEmpty()) {
                    let newIdea = Idea.new(user.uid, terminal, keywords);
                    let newEntry = EntryParser.parseEntry(user.uid, newIdea.ideaId, terminal);
                    try {
                        await axios.post(`/api/idea`, newIdea);
                    } catch (error) {
                        console.error("Error creating idea:", error, newIdea);
                    }
                    try {
                        await axios.post(`/api/entry`, newEntry);
                    }
                    catch (error) {
                        console.error("Error creating entry:", error, newEntry);
                    }

                } else {
                    let newEntry = EntryParser.parseEntry(user.uid, idea.ideaId, terminal);

                    try {
                        await axios.post(`/api/entry`, newEntry);
                    }
                    catch (error) {
                        console.error("Error creating entry:", error, newEntry);
                    }

                }

            } else {
                if (confirmation){
                    await authRepository.signIn(confirmation, terminal);
                }
                let phoneNumber = terminal;
                console.log(phoneNumber);
                let phoneNumberValid = EntryParser.isPhoneNumberValid(phoneNumber);
                if (phoneNumberValid) {
                    let confirmation = await authRepository.sendPhoneNumberAuthCode(phoneNumber);
                    setConfirmation(confirmation);
                } else {
                    console.log("Phone number invalid")
                }
            
            }
       
        }
    };
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);


    useEffect(() => {
        const helperTexts = [
            'I just got an idea...',
            // 'I want to build an app that sends Notifications to Users based on Topics they\'ve subscribed to...',
            // 'I want to go to a coding bootcamp, and then get a job as a Software Engineer...',
            // 'I want to program a phone number that allows people to text it to ask questions from the perspective of an ancient mystic named...',
            // 'I want to create a website using three.js that allows users to create their own 3D models...',
            // 'I want to store ideas and keywords to contextualize the AI generated responses...',
            // 'I want to an app that will break up the Lord\'s prayer in his native tongue of Aramaic and transliterate it in push notifications...',
        ];

        let currentTextIndex = 0;
        const intervalId = setInterval(() => {
            currentTextIndex = (currentTextIndex + 1) % helperTexts.length;
            setHelperText(helperTexts[currentTextIndex]);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    let getSize = () => {
        let baseSize = 2.5;
        if (terminalValue.length > 0) {
            baseSize = baseSize - terminalValue.length / 10;
        }
        if (baseSize < 0.333) {
            baseSize = 0.333;
        }
        return baseSize;
    }
    const I_JUST_GOT_AN_IDEA = 'i-just-got-an-idea$ ';
    let getValue = () => {
        if (terminalValue.length > 0) {
            return I_JUST_GOT_AN_IDEA + idea;
        } else {
            return I_JUST_GOT_AN_IDEA;
        }
    }


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

        </div>
    );
};

export default HomePage;
