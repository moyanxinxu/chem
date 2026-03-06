import Link from "next/link";

const app2links = [{ title: "试剂管理", href: "/reagent" }];

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="flex h-12 p-2 items-center gap-4 bg-black"></div>
      <div className="h-full flex-1 grid grid-cols-4 bg-purple-50 p-4">
        {app2links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
