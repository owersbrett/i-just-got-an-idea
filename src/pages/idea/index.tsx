import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/firestore";

interface Notification {
  id: string;
  message: string;
  type: string;
  metadata: {
    ideaId: string;
    userId: string;
    // Add other metadata properties as needed
  };
}

interface Idea {
  id: string;
  userId: string;
  text: string;
  // Add other properties as needed
}

const IdeaPage = () => {
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch idea from backend
    const fetchIdea = async () => {
      const ideaId = router.query.ideaId as string;
      // Add logic to fetch idea based on ideaId
      // and update the state with the result
    };
    fetchIdea();

    // Fetch notifications from backend every 5 seconds
    const intervalId = setInterval(() => {
      const userId = "user123"; // Replace with actual user ID
      const ideaId = router.query.ideaId as string;
      // Fetch notifications based on userId and ideaId
      const notificationsRef = firebase.firestore().collection("notifications");
      notificationsRef
        .where("metadata.ideaId", "==", ideaId)
        .where("metadata.userId", "==", userId)
        .get()
        .then((querySnapshot) => {
          const fetchedNotifications = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Notification[];
          setNotifications(fetchedNotifications);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [router.query.ideaId]);

  return (
    <div>
      {/* Render idea and notifications */}
    </div>
  );
};

export default IdeaPage;
