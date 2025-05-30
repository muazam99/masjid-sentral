"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import Image from "next/image";
import ProfileCard from "@/app/modules/profile/ProfileCard";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";

export default function Header() {
  const { data: session, isPending: loading } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/ms_logo.png" width={40} height={40} alt="Logo" />
            <span className="hidden font-bold sm:inline-block text-primary">
              MASJID SENTRAL
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {/* <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Tentang Kami
            </Link> */}
            {/* <Link href="/map" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Peta Masjid
            </Link>
            <Link href="/add" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Tambah Masjid
            </Link> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {loading ? (
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            ) : session ? (
              <ProfileCard />
            ) : (
              <>
                <Link href="/auth/sign-in" className="text-primary">
                  <Button variant="ghost" className="text-primary">
                    Log Masuk
                  </Button>
                </Link>
                <Link href="/auth/sign-up" className="text-primary">
                  <Button className="bg-primary text-primary-foreground">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </nav>
          {/* Mobile Title */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link
              href="/"
              className="flex md:hidden items-center justify-center w-full"
            >
              <span className="font-bold text-primary">MASJID SENTRAL</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
