"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";

const ProfileCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending: loading } = authClient.useSession();

  const logout = async () => {
    await authClient.signOut();
    toast.success("Berjaya log keluar");
  };

  return (
    <div className="relative">
      <Card
        className="px-4 py-1 my-4 cursor-pointer hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium leading-none mr-2">
            {session?.user.name}
          </div>
          <Avatar>
            <AvatarImage
              src={session?.user.image || undefined}
              alt={session?.user.name || "User"}
            />
            <AvatarFallback>
              {session?.user.name ? session?.user.name[0] : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </Card>
      {isOpen && (
        <Card className="absolute right-0 w-40 py-2 shadow-lg z-50">
          <div className="flex flex-col space-y-1 px-1">
            <Button
              disabled={loading}
              variant="ghost"
              className="justify-start gap-2"
              onClick={() => console.log("Action 1 clicked")}
            >
              <User className="h-4 w-4 mr-2" />
              <span>Profile</span>
            </Button>
            <Button
              disabled={loading}
              variant="ghost"
              className="justify-start gap-2"
              onClick={() => console.log("Action 2 clicked")}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </Button>
            <Button
              disabled={loading}
              variant="ghost"
              className="justify-start gap-2 text-red-500 hover:text-red-600"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfileCard;
