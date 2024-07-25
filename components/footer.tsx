import { FishIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-600">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 text-foreground ">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <FishIcon />
          <p className="text-center text-sm leading-loose md:text-left">
            A{" "}
            <a
              rel="noopener"
              href="https://statoasis.com"
              target="_blank"
              className="font-medium underline underline-offset-4"
            >
              StatOasis
            </a>{" "}
            project.
          </p>
        </div>
      </div>
    </footer>
  );
};
