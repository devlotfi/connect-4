import { Outlet } from "react-router-dom";
import Logo from "../assets/logo.svg";
import ThemeToggle from "../components/theme-toggle.component";

export default function MainLayout() {
  return (
    <>
      <div className="flex justify-between items-center p-[1rem]">
        <div className="flex items-center space-x-2">
          <img className="h-[2.5rem]" src={Logo} alt="logo" />
          <div className="flex text-[15pt]">Connect 4</div>
        </div>

        <ThemeToggle></ThemeToggle>
      </div>
      <Outlet></Outlet>
    </>
  );
}
