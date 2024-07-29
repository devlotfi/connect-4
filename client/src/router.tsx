import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/main-layout.component";
import StartPage from "./pages/start-page.component";
import OnlineGamePage from "./pages/online-game-page.component";
import LocalGamePage from "./pages/local-game-page.component";
import SocketIOProvider from "./context/socket-io.context";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <StartPage></StartPage>,
      },
      {
        path: "/online",
        element: (
          <SocketIOProvider>
            <OnlineGamePage></OnlineGamePage>
          </SocketIOProvider>
        ),
      },
      {
        path: "/local",
        element: <LocalGamePage></LocalGamePage>,
      },
    ],
  },
]);
