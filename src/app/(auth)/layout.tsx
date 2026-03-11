import { AuthLayoutProps } from "@/schema/common";

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-200">
      {children}
    </div>
  );
}
