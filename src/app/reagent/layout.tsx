import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Header } from "@/components/header/header";

import { appLinks } from "@/constant/common";
import { ReagentLayoutProps } from "@/schema/common";

export default function ReagentLayout({ children }: ReagentLayoutProps) {
  return (
    <div className="flex flex-col w-full h-full">
      <Header
        lchild={
          <Breadcrumb>
            <BreadcrumbList>
              {appLinks.map((link) => (
                <>
                  <BreadcrumbItem key={link.idx}>
                    <BreadcrumbLink
                      className="text-white hover:text-white"
                      href={link.href}
                    >
                      {link.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {link.idx !== appLinks.length && (
                    <BreadcrumbSeparator key={link.idx} />
                  )}
                </>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        }
      />
      {children}
    </div>
  );
}
