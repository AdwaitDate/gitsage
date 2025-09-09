'use client';
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";
import { useEffect, useState } from "react";

type LogoProps = {
  fontSize?: string;
  imgSize?: number;
};

function Logo({ fontSize = "text-xl", imgSize = 50 }: LogoProps) {
  const { open } = useSidebar();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return (
    <Link href="/dashboard" className={cn("flex items-center gap-1", fontSize)}>
      <Image src="/logo.png" alt="logo" width={imgSize} height={imgSize} />
      {isClient && open && (
        <h1 className="text-primary/80 font-bold" style={{ fontSize: "inherit" }}>
          GitSage
        </h1>
      )}
    </Link>
  );
}

export default Logo;
