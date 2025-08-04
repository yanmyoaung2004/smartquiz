import React from "react";
import { Notification } from "./Notification";
import { UserDialog } from "./UserDialog";
import { ModeToggle } from "./ModeToggle";

const Navbar = ({ notifications, setNotifications }) => {
  return (
    <>
      <div className="flex gap-4">
        <ModeToggle />
        <Notification
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <UserDialog />
      </div>
    </>
  );
};

export default Navbar;
