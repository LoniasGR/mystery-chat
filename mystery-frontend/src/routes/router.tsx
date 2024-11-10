import { createBrowserRouter } from "react-router-dom";

import Chat from "@/views/Chat";
import Login from "@/views/Login";

import Protected from "./protected";
import Public from "./public";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Chat />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: (
      <Public>
        <Login />
      </Public>
    ),
  },
]);

export default router;
