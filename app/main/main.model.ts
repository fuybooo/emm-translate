export interface MenuData {
  name: string;
  code: string;
  isActive?: boolean;
  isParent?: boolean;
  url?: string;
  children?: MenuData[];
  suffix?: string;
  advanced?: boolean;
}

