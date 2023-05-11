import {collection,QueryDocumentSnapshot,DocumentData,query,where,limit,getDocs} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from 'firebase/app'
import 'firebase/firestore'
import { firestore } from "../../../firebase/clientApp";
import { NotificationRepository } from "@/repository/notificationRepository";
import { User, Notification, Idea } from "@/common/types";
import { UserRepository } from "@/repository/userRepository";
import { IdeaRepository } from "@/repository/ideaRepository";





const IdeaPage = (userId: string | undefined) => {
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  const getNotifications = async (id: string) => {
    const notifications = await NotificationRepository.findByUserId(id);
    setNotifications( notifications);
  }
  const getUser = async (id: string) => {
    const user = await UserRepository.findById(id);
    if (user){
      setUser( user);
      return user;

    } else {
      throw new Error("User not found");
    }
  }
  async function createUser() {
    const newUser = User.new("Brett");
    const user = await UserRepository.create(newUser);
    setUser(user);
    return user;
  }
  const deleteAllUsers = async () => {
    const user = await UserRepository.deleteAll();
  }
  const fetchIdea = async (user: User) => {
    const ideaId = router.query.ideaId as string;
    if (ideaId){
    }
    return IdeaRepository.findById(ideaId).then((idea) => {
      if (idea) {
        setIdea(idea!);
      } else {
        // Notification.new(user.userId, );
// 
      }
      return idea;
    });
  };

const setTimer = (user: User) => {
  fetchIdea(user); 
  
}


  useEffect(() => {
    if (userId){
      createUser().then(setTimer)
    } else {
      getUser(userId!).then(setTimer);
    }
    
      // const intervalId = setInterval(() => {
      //   const userId = "brett"; // Replace with actual user ID
      //   const ideaId = router.query.ideaId as string;
      //   // Fetch notifications based on userId and ideaId
      //   const notificationsRef = firestore.collection("notifications");
      //   notificationsRef
      //     .where("metadata.ideaId", "==", ideaId)
      //     .where("metadata.userId", "==", userId)
      //     .get()
      //     .then((querySnapshot) => {
      //       const fetchedNotifications = querySnapshot.docs.map((doc) => ({
      //         id: doc.id,
      //         ...doc.data(),
      //       })) as Notification[];
      //       setNotifications(fetchedNotifications);
      //     })
      //     .catch((error) => {
      //       console.error("Error fetching notifications:", error);
      //     });
      // }, 5000);

    

    // Fetch notifications from backend every 5 seconds

    // return () => clearInterval(intervalId);
  }, [router.query.ideaId]);

  return (
    <div>
      {/* Render idea and notifications */}
    </div>
  );
};

export default IdeaPage;
