import {
  signInWithPhoneNumber,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  User,
  IdTokenResult,
  UserMetadata,
  RecaptchaVerifier,
  RecaptchaParameters,
  ConfirmationResult,
  UserCredential,
} from "firebase/auth";
import { auth } from "../../firebase/clientApp";
import * as types from "@/common/types";

interface AuthRepository {
  sendPhoneNumberAuthCode: (phoneNumber: string) => Promise<ConfirmationResult>;
  signIn: (confirmationResult: ConfirmationResult, code: string) => Promise<UserCredential>;
//   signUp: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  onAuthStateChanged: (callback: (user: User | null) => void) => void;
}

const authRepository: AuthRepository = {
    signIn: async (confirmationResult: ConfirmationResult, code: string): Promise<UserCredential> => {
        const credential = await confirmationResult.confirm(code);
        if (credential) {
            return credential;
        } else {
            throw new Error("Error signing in");
        }

    },
    sendPhoneNumberAuthCode: async (phoneNumber: string) => {
        return await signInWithPhoneNumber(auth, phoneNumber, new RecaptchaVerifier(phoneNumber, {}, auth));
    },

    signOut: async () => {
        try {
            await signOut(auth);
            // Handle successful sign-out
        } catch (error) {
            // Handle sign-out error
        }
    },
    onAuthStateChanged: function (callback: (user: User | null) => void): void {
        throw new Error("Function not implemented.");
    }
};

export default authRepository;
