export interface NavItem {
  title: string;
  href: string;
  icon: string;
  children?: Array<{
    title: string;
    href: string;
  }>;
}