import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type BellIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  unreadCount: number; // To show the unread notification count
}

