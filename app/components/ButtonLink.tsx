import { Link } from "react-router";

interface ButtonLinkProps {
  href: string;
}

export default function ButtonLink({ href }: ButtonLinkProps) {
  return (
    <Link
      to={href}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-offWhite bg-darkTeal rounded-lg hover:bg-lightTeal hover:text-darkTeal focus:ring-4 focus:ring-darkTeal transition-all">
      Read more
      <svg
        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 10">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 5h12m0 0L9 1m4 4L9 9"
        />
      </svg>
    </Link>
  );
}
