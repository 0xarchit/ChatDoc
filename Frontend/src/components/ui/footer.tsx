import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t bg-background/95">
      <div className="container flex h-14 items-center justify-center text-xs sm:text-sm text-muted-foreground">
        <span>
          © {year} 
          {" "}
          <a
            href="https://0xarchit.carrd.co"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium hover:underline"
          >
            0xarchit
          </a>
        </span>
      </div>
    </footer>
  );
}
