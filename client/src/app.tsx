import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}
