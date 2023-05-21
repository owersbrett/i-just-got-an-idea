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
  ApplicationVerifier,
} from "firebase/auth";
import { auth } from "../../firebase/clientApp";
import * as types from "@/common/types";

interface AuthRepository {
  sendPhoneNumberAuthCode: (phoneNumber: string, captcha: ApplicationVerifier) => Promise<ConfirmationResult>;
  signIn: (confirmationResult: ConfirmationResult, code: string) => Promise<UserCredential>;
//   signUp: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  onAuthStateChanged: (callback: (user: User | null) => void) => void;
}

const authRepository: AuthRepository = {
    signIn: async (confirmationResult: ConfirmationResult, code: string): Promise<UserCredential> => {
        console.log("signing in");
        const credential = await confirmationResult.confirm(code);
        if (credential) {
            return credential;
        } else {
            throw new Error("Error signing in");
        }

    },
    sendPhoneNumberAuthCode: async (phoneNumber: string, captcha: ApplicationVerifier) => {
        try {

            return await signInWithPhoneNumber(auth, phoneNumber, captcha);
        }
        catch (e){
            console.log(e)
            throw new Error("Error sending auth code");
        }
    },

    signOut: async () => {
        try {
            console.log("Signing out...")
            await signOut(auth);
        } catch (error) {
            console.log("Sign out error: ", error)
        }
    },
    onAuthStateChanged: function (callback: (user: User | null) => void): void {
        throw new Error("Function not implemented.");
    }
};

export default authRepository;
