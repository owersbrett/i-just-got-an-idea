import { User } from "@/common/types";
import React from "react";

interface UserComponentProps {
  user: User | null;
}

const UserComponent: React.FC<UserComponentProps> = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user?.name}!</h2>
    </div>
  );
};

export default UserComponent;
