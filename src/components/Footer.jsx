import { Link } from 'react-router-dom'

const MOVIE_LINKS = [
  { label: 'Popular', path: '/movies/popular' },
  { label: 'Trending', path: '/movies/trending' },
  { label: 'Top Rated', path: '/movies/top_rated' },
  { label: 'Now Playing', path: '/movies/now_playing' },
  { label: 'Upcoming', path: '/movies/upcoming' },
]
const TV_LINKS = [
  { label: 'Popular', path: '/series/popular' },
  { label: 'Trending', path: '/series/trending' },
  { label: 'Top Rated', path: '/series/top_rated' },
  { label: 'On The Air', path: '/series/on_the_air' },
  { label: 'Airing Today', path: '/series/airing_today' },
]

const Footer = () => {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-glass bg-(--nav-bg) text-foreground backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(165,201,202,0.14),transparent_45%)]" />
      <div className="relative mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-10 sm:grid-cols-2 sm:px-6 md:px-8 lg:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-wide text-accent">ROUNDHAY</h3>
          <p className="max-w-xs text-sm text-muted-foreground">
            Browse movies and TV shows with categories updated daily.
          </p>
        </div>

        <nav aria-label="Movies links" className="space-y-2">
          <h4 className="text-xl font-medium">Movies</h4>
          {MOVIE_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block text-sm text-muted-foreground transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="TV links" className="space-y-2">
          <h4 className="text-xl font-medium">TV Series</h4>
          {TV_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block text-sm text-muted-foreground transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="relative border-t border-glass py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Roundhay. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
