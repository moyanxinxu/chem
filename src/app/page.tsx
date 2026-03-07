import Link from "next/link";
import { apps } from "@/constant/common";

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="flex h-12 p-2 items-center gap-4 bg-black"></div>
      <div className="h-full flex-1 grid grid-cols-4 bg-purple-50 p-4">
        {apps.map((app) => (
          <Link key={app.href} href={app.href}>
            {app.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
