import { useEffect } from "react";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { socket } from "../../utils/socket";

export const JoinRoomOnLogin = () => {
  const user = useSelector((state: RootState) => state.users.user);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join_room", user._id);
    }
  }, [user]);

  return null;
};