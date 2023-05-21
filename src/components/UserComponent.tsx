
import { User } from "firebase/auth";
import React from "react";

interface UserComponentProps {
  user: User | null;
}

const UserComponent: React.FC<UserComponentProps> = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user?.displayName}!</h2>
    </div>
  );
};

export default UserComponent;
