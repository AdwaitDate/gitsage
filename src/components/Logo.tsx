import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  open?: boolean;
  fontSize?: string;
  imgSize?: number;
};

function Logo({
  open = true,
  fontSize = "text-xl",
  imgSize = 50,
}: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-1", fontSize)}>
      <Image src="/logo.png" alt="logo" width={imgSize} height={imgSize} />
      {open && (
        <h1 className="text-primary/80 font-bold" style={{ fontSize: "inherit" }}>
          GitSage
        </h1>
      )}
    </Link>
  );
}

export default Logo;