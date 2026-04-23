import { useEffect, useState } from "react"
import { Globe, Menu, Moon, Search, Sun, User, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const NAV_ITEMS = ["Home", "Movies", "Tv Shows"]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    return (
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])


  const iconBtnClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-primary/20 text-primary-foreground transition hover:-translate-y-0.5 hover:bg-accent/40 md:h-9 md:w-9"

  return (
    <>
      <header className="sticky top-2 z-40 flex min-h-[60px] items-center gap-3 rounded-[18px] border border-accent/45 bg-primary/75 px-3 py-2 text-primary-foreground shadow-lg backdrop-blur-[10px] md:top-4 md:min-h-[68px] md:gap-6 md:rounded-full md:px-[18px] md:py-[10px]">
        <a
          href="#"
          aria-label="Roundhay home"
          className="inline-flex items-center gap-2.5 text-inherit no-underline"
        >
          <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-accent font-bold text-accent-foreground">
            R
          </span>
          <span className="hidden text-[0.98rem] font-semibold md:inline">
            Roundhay
          </span>
        </a>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-accent/30 text-primary-foreground md:hidden"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[22px] md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href="#"
              className="text-[0.95rem] text-primary-foreground/95 no-underline transition hover:text-accent hover:opacity-100"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="ml-auto inline-flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={iconBtnClass}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label="Choose language" className={iconBtnClass}>
                <Globe size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English {language === "en" ? "✓" : ""}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ar")}>
                العربية {language === "ar" ? "✓" : ""}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            aria-label="Search"
            className={iconBtnClass}
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label="Profile"
            className={iconBtnClass}
          >
            <User size={18} />
          </button>
        </div>
      </header>

      <nav
        id="mobile-navigation"
        aria-label="Mobile main navigation"
        className={`${isMenuOpen ? "block" : "hidden"} mt-2 overflow-hidden rounded-2xl border border-accent/50 bg-card shadow-lg md:hidden`}
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href="#"
            className="block border-b border-border/60 px-[14px] py-3 text-foreground no-underline last:border-b-0"
          >
            {item}
          </a>
        ))}
      </nav>
    </>
  )
}

export default Header
