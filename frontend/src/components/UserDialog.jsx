import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut, User } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "@/store/user/userSlice";

export function UserDialog() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(signoutSuccess());
    navigate("/login");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Notifications"
          className={"cursor-pointer"}
        >
          <User className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3.5">
          <div className="flex gap-3 mb-3">
            <img
              src={currentUser?.profileImage}
              alt=""
              width={"45px"}
              className="rounded-full bg-red-400"
            />
            <div>
              <p className="text-slate-800 font-semibold dark:text-slate-300">
                {currentUser && currentUser.username}
              </p>
              <p className="text-slate-800 text-sm  dark:text-slate-300">
                {currentUser && currentUser.email}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1.5 mt-1.5">
            <Link to={"/settings"}>
              <Button
                variant={"ghost"}
                className="w-full flex justify-start hover:bg-gray-100 cursor-pointer"
              >
                <User className="mr-1 h-5 w-5" />
                User Profile
              </Button>
            </Link>
            <Button
              onClick={logout}
              variant={"ghost"}
              className="w-full flex justify-start hover:bg-gray-100 cursor-pointer"
            >
              <LogOut className="mr-1 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
