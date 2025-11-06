'use client';
import React from "react";
import {IUser}  from "@/interfaces";
import { useRouter } from "next/dist/client/components/navigation";
import { Menu } from "lucide-react";
import MenuIems from "./menu-items";

function Header({ user }: { user: IUser | null }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = React.useState(false);

  return (
    <div>
      <header className="bg-primary p-6 mb-8 shadow-md flex justify-between">
        <div className="flex items-center gap-3">
          <a
            onClick={() => router.push("/")}
            className="flex items-center gap-3 text-4xl font-bold cursor-pointer"
          >
            <b className="text-secondary">Go.</b>
            <b className="text-blue-500">Gym</b>
          </a>
        </div>
        <div className="flex items-center gap-6">
          <h1 className="text-lg text-white/80 "><i className="">{user?.name}</i></h1>
          <Menu
            className="text-white hover:text-gray-300 cursor-pointer"
            size={25}
            onClick={() => setOpenMenu(!openMenu)} 
          />
        </div>
      </header>
      {openMenu && user && (
        <MenuIems user={user} openMenu={openMenu} setOpenMenu={setOpenMenu} />
      )}
    </div>
  );
}

export default Header;
