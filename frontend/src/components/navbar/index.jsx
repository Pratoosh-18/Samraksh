import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "@/context/app-provider";
import { SamrakshIcon } from "./icons";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import ConfirmModal from "../confirmModal";

function Navbar() {
  const { isAuthenticated, handleLogout } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    handleLogout();
    setIsLogoutModalOpen(false);
  };

  // Nav items for unauthenticated and authenticated users
  const unauthenticatedNavRoutes = [
    { path: "/", name: "Home" },
    { path: "/report-lost-child", name: "Report Lost Child" },
    { path: "/login", name: "Login" },
  ];

  const authenticatedNavRoutes = [
    { path: "/", name: "Home" },
    { path: "/cctvdashboard", name: "CCTV Dashboard" },
    { path: "/detection", name: "Detection" },
    { path: "/lost-reports", name: "Lost Reports" },
    { path: "/sos", name: "SOS" },
  ];

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-brand-50 shadow-md">
      <NavLink to="/" className="mr-auto">
        <SamrakshIcon className="h-12 text-brand-600" />
      </NavLink>

      <button
        className="block md:hidden"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <div className="space-y-2">
          {isMenuOpen ? (
            <IoMdClose className="text-4xl text-brand-900" />
          ) : (
            <IoMdMenu className="text-4xl text-brand-900" />
          )}
        </div>
      </button>

      <div className="hidden md:flex gap-6">
        {(isAuthenticated ? authenticatedNavRoutes : unauthenticatedNavRoutes).map(
          (route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                isActive
                  ? "underline text-lg underline-offset-8 text-brand-600"
                  : "no-underline text-lg underline-offset-8 text-brand-900 hover:text-brand-600"
              }
            >
              {route.name}
            </NavLink>
          )
        )}

        {isAuthenticated && (
          <button
            type="button"
            className="underline-offset-2 text-lg text-brand-900 hover:text-brand-600"
            onClick={openLogoutModal}
          >
            Logout
          </button>
        )}
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-full bg-white md:hidden shadow-lg flex flex-col items-center py-4 z-50">
          {(isAuthenticated ? authenticatedNavRoutes : unauthenticatedNavRoutes).map(
            (route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className="block py-2 text-lg text-brand-900 hover:text-brand-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {route.name}
              </NavLink>
            )
          )}

          {isAuthenticated && (
            <button
              type="button"
              className="block py-2 text-lg text-brand-900 hover:text-brand-600"
              onClick={() => {
                openLogoutModal();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}

      {isLogoutModalOpen && (
        <ConfirmModal
          message="Are you sure you want to log out?"
          onConfirm={confirmLogout}
          onClose={() => setIsLogoutModalOpen(false)}
          confirmColor="bg-red-500"
        />
      )}
    </div>
  );
}

export default Navbar;
