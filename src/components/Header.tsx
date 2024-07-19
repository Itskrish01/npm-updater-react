export default function Header() {
  return (
    <header className="bg-transparent">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
      >
        <div className="flex items-center gap-x-12">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img alt="" src="icon.png" className="h-12 w-auto" />
          </a>
        </div>
        <div className="flex">
          <a
            href="https://itskrish01-portfolio.netlify.app/"
            target="_blank"
            className="text-sm font-semibold leading-6 text-white"
          >
            About me <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
