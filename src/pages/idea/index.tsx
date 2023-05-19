import { collection, QueryDocumentSnapshot, DocumentData, query, where, limit, getDocs } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from 'firebase/app'
import 'firebase/firestore'
import { firestore } from "../../../firebase/clientApp";
import { NotificationRepository } from "@/repository/notificationRepository";
import { User, Notification, Idea, Entry } from "@/common/types";
import { UserRepository } from "@/repository/userRepository";
import { IdeaRepository } from "@/repository/ideaRepository";
import ChatComponent from "@/components/ChatComponent";
import { EntryRepository } from "@/repository/entryRepository";
import KeywordsComponent from "@/components/KeywordsComponent";
import UserComponent from "@/components/UserComponent";
import axios from "axios";
import NotificationFeed from "@/components/NotificationFeedComponent";
import '../styles/idea.css'






const IdeaPage = (userId: string | undefined) => {

  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);

  const updateKeywords = (newKeywords: string[]) => {
    setKeywords(newKeywords);
  }

  const createEntry = async (newEntry: Entry) => {
    await EntryRepository.create(newEntry);
  }
  const createIdea = async (newIdea: Idea) => {
    await IdeaRepository.create(newIdea);
    return idea;
  }
  const submitEntry = async (value: string) => {
    let entry: Entry;
    if (idea && user) {
      // entry = Entry.new(value, idea.id, value);
      // setEntry(entry);
    } else if (user) {
      // let newIdea = Idea.new(user.userId, value, keywords);
      // await IdeaRepository.create(newIdea);
      // entry = Entry.new(value, newIdea.id, value);
      // setEntry(entry);
    }


  }

  const getNotifications = async (id: string) => {
    try {
      const notifications = (await axios.get("http://localhost:3000/api/notifications?userId=" + id)).data.notifications;
      console.log(notifications);
      setNotifications(notifications);
    } catch (e) {
      console.log(e)
    }
  }
  const getUser = async (id: string) => {
    console.log(id);
    try {

      const user = (await axios.get("http://localhost:3000/api/user?userId=" + id)).data.user;
      console.log(user);
      if (user) {
        setUser(user);
        return user;
      } else {
        throw new Error("User not found");
      }
    } catch (e){
      console.log(e);
    }
  }
  async function createUser() {
    const newUser = User.new("Brett");
    const user = (await axios.post("http://localhost:3000/api/user", newUser)).data.user;
    
    setUser(user);
    return user;
  }
  const trySetIdea = async (user: User): Promise<User> => {
    const ideaId = router.query.ideaId as string;
    if (ideaId) {
      IdeaRepository.findById(ideaId).then((idea) => {
        if (idea) {
          setIdea(idea!);
        }
      });
    }
    return user;
  };

  const startTimer = (user: User) => {
    console.log("Got user. Starting timer to periodically grab notifications...");
    const timer = setTimeout(() => getNotifications(user.userId), 5000);
    setTimer(timer);
  }
  const stopTimer = () => {
    clearInterval(timer!);
  }



  useEffect(() => {
    console.log("Getting user...");
    getUser("fccd9b8e-df25-44a8-8297-224f44626482").then(startTimer);;
  }, []);
  useEffect(() => {
    trySetIdea(user!);
  }, [router.query.ideaId]);

  return (
    <div>
      <div className="parent-container">
      <UserComponent user={user} />
      <NotificationFeed notifications={notifications} />
      </div>
      <div>
        <p>Keywords:</p>
        <KeywordsComponent initialKeywords={keywords} keywordHandler={updateKeywords} />
      </div>
      <ChatComponent initialMessages={[]} submitEntry={submitEntry} />
    </div>
  );
};

export default IdeaPage;


