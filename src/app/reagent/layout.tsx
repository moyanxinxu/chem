import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const links = [
  { idx: 1, title: "首页", href: "/" },
  { idx: 2, title: "试剂管理", href: "/reagent" },
];

interface ReagentLayoutProps {
  children: React.ReactNode;
}

export default function ReagentLayout({ children }: ReagentLayoutProps) {
  return (
    <div className="w-full h-full">
      <div className="flex h-12 p-2 items-center gap-4 bg-black">
        <Breadcrumb>
          <BreadcrumbList>
            {links.map((link) => (
              <>
                <BreadcrumbItem key={link.idx}>
                  <BreadcrumbLink
                    className="text-white hover:text-white"
                    href={link.href}
                  >
                    {link.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {link.idx !== links.length && (
                  <BreadcrumbSeparator key={link.idx} />
                )}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </div>
  );
}
