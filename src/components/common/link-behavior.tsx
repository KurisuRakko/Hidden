import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
} from "react";

type LinkBehaviorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> &
  Omit<NextLinkProps, "href"> & {
    href: NextLinkProps["href"];
  };

export const LinkBehavior = forwardRef<HTMLAnchorElement, LinkBehaviorProps>(
  function LinkBehavior(props, ref) {
    return <NextLink ref={ref} {...props} />;
  },
);
