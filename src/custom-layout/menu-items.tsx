import Home from "@/app/page";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "@/components/ui/sheet";
import { IUser } from "@/interfaces";
import { Heart, HeartHandshake, HeartHandshakeIcon, HomeIcon, List, ShieldCheck, User2, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";

interface IMenuItemProps {
  user: IUser;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

function MenuIems({ user, openMenu, setOpenMenu }: IMenuItemProps) {
  const iconSize = 20;
  const pathname = usePathname();
  const router = useRouter();
  const userMenuItems = [
    {
      name: "Home",
      icon: <HomeIcon size={iconSize} />,
      router: "/account",
    },
    {
      name: "Profile",
      icon: <User2 size={iconSize} />,
      router: "/account/user/profile",
    },
    {
      name: "Subscriptions",
      icon: <ShieldCheck size={iconSize} />,
      router: "/account/user/subscriptions",
    },
    {
      name: "Referrals",
      icon: <Heart size={iconSize} />,
      router: "/account/user/referrals",
    },
  ];

  const adminMenuItems = [
    {
      name: "Home",
      icon: <HomeIcon size={iconSize} />,
      router: "/account",
    },
    {
      name: "Users",
      icon: <Users size={iconSize} />,
      router: "/account/admin/users",
    },
    {
      name: "Subscriptions",
      icon: <ShieldCheck size={iconSize} />,
      router: "/account/admin/subscriptions",
    },
    {
      name: "Customers",
      icon: <List size={iconSize} />,
      router: "/account/admin/customers",
    },
    {
        name: "Referrals",
        icon: <HeartHandshake size={iconSize} />,
        router: "/account/admin/referrals",
    }
  ];

  const menuItemsToRender = user.is_admin ? adminMenuItems : userMenuItems;

  return (
    <Sheet open={openMenu} onOpenChange={setOpenMenu}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-10 mt-20">
          {menuItemsToRender.map((item, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer gap-3 mx-4 p-3 ${
                pathname === item.router
                  ? "bg-gray-100 border border-gray-300  rounded-md"
                  : ""
              }`}
                onClick={() => {
                    router.push(item.router)
                    setOpenMenu(false);
                }} 
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MenuIems;
