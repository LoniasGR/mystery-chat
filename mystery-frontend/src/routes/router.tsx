import { createBrowserRouter } from "react-router-dom";

import Chat from "@/views/Chat";
import Login from "@/views/Login";

import Protected from "./protected";

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
    element: <Login />,
  },
]);

export default router;
