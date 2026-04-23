const MOVIE_LINKS = ["Popular", "Trending", "Top Rated", "Now Playing", "Upcoming"]
const TV_LINKS = ["Popular", "Trending", "Top Rated", "On The Air", "Airing Today"]

const Footer = () => {
  return (
    <footer className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-t border-accent/30 bg-primary/95 text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(165,201,202,0.14),transparent_45%)]" />
      <div className="relative grid gap-10 px-3 py-10 sm:grid-cols-2 md:px-6 lg:grid-cols-3 lg:px-10">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-wide text-accent">ROUNDHAY</h3>
          <p className="max-w-xs text-sm text-primary-foreground/80">
            Browse movies and TV shows with categories updated daily.
          </p>
        </div>

        <nav aria-label="Movies links" className="space-y-2">
          <h4 className="text-xl font-medium">Movies</h4>
          {MOVIE_LINKS.map((item) => (
            <a
              key={item}
              href="#"
              className="block text-sm text-primary-foreground/75 transition hover:text-accent"
            >
              {item}
            </a>
          ))}
        </nav>

        <nav aria-label="TV links" className="space-y-2">
          <h4 className="text-xl font-medium">TV Series</h4>
          {TV_LINKS.map((item) => (
            <a
              key={item}
              href="#"
              className="block text-sm text-primary-foreground/75 transition hover:text-accent"
            >
              {item}
            </a>
          ))}
        </nav>
      </div>

      <div className="relative border-t border-accent/20 py-4 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} Roundhay. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
