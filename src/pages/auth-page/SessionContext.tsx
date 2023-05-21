'use client';
import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import { User, onAuthStateChanged } from "firebase/auth"; // Assuming you have imported the necessary types for Firebase Auth
import { auth } from "../../../firebase/clientApp";
import { Session } from "@/common/types/session";
import { UserContext } from '@/pages/auth-page/UserContext';
import axios from "axios";




interface SessionContextType {
    session: Session;
}

const sessionContext: SessionContextType = {
    session: new Session(null),

};

export const SessionContext = createContext<SessionContextType>(sessionContext);

interface SessionContextProviderProps {
    children: ReactNode;
}

export function SessionContextProvider({ children }: SessionContextProviderProps) {
    const { user } = useContext(UserContext);

    const [session, setSession] = useState<Session>(sessionContext.session);
    useEffect(() => {
        console.log("Let's set the session!")
        if (user){
            console.log("Oh boy!")
            let userSession = session;
            userSession.uid = user.uid;
            axios.put('/api/session', userSession);
            console.log(userSession)
            setSession(userSession);
        }
    }), [user];

    return (
        <SessionContext.Provider value={{ session }}>
            {children}
        </SessionContext.Provider>
    );
}
