interface PageSchema<T> {
  page: number;
  size: number;
  total: number;
  items: T[];
}

interface ApiResponseSchema<T> {
  code: number;
  message: string;
  data: T;
}

interface LabelValueSchema {
  label: string;
  value: string;
}

//

interface ReagentLayoutProps {
  children: React.ReactNode;
}

interface RootLayoutProps {
  children: React.ReactNode;
}

interface QueryProviderProps {
  children: React.ReactNode;
}

type IconLinkProps = {
  icon: React.ReactNode;
  href: string;
};

export type { ApiResponseSchema, LabelValueSchema, PageSchema };
export type { IconLinkProps };
export type { RootLayoutProps, ReagentLayoutProps };
export type { QueryProviderProps };
