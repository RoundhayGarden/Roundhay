import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User, Sun, Moon, Menu, X, Bookmark, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';

export default function Navbar() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // ── Zustand ──────────────────────────────────────────
    const theme        = useAppStore(s => s.theme);
    const toggleTheme  = useAppStore(s => s.toggleTheme);
    const wishlist     = useAppStore(s => s.wishlist);

    // Apply theme class to <html> on mount and whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
    }, [theme]);

    // Scroll listener
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { name: 'Home',       path: '/' },
        { name: 'Movies',     path: '/movies' },
        { name: 'Series',     path: '/series' },
        { name: 'Collection', path: '/collection' },
    ];

    const isActive = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4"
                style={{ paddingTop: scrolled ? '8px' : '18px', paddingBottom: scrolled ? '8px' : '18px' }}
            >
                <div
                    className="flex items-center justify-between px-5 md:px-8 py-3 rounded-2xl transition-all duration-500 mx-auto"
                    style={{
                        maxWidth: '1400px',
                        background: scrolled ? 'var(--nav-bg)' : 'transparent',
                        backdropFilter: scrolled ? 'blur(24px)' : 'none',
                        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
                        border: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
                        boxShadow: scrolled ? '0 8px 32px var(--shadow-color)' : 'none',
                    }}
                >
                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                            style={{
                                background: 'linear-gradient(135deg, var(--accent), var(--primary))',
                                color: 'var(--accent-foreground)',
                                boxShadow: '0 4px 14px var(--movie-accent)',
                            }}
                        >
                            ▶
                        </div>
                        <span
                            className="font-black text-xl tracking-tighter"
                            style={{ color: 'var(--foreground)' }}
                        >
                            Roundhay<span style={{ color: 'var(--accent)' }}>.</span>
                        </span>
                    </Link>

                    {/* ── Desktop Links ── */}
                    <div className="hidden md:flex items-center gap-7">
                        {links.map(item => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`nav-link text-sm ${isActive(item.path) ? 'active' : ''}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* ── Action Icons ── */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <Button
                            variant="icon"
                            size="icon-sm"
                            asChild
                            className={isActive('/search') ? 'text-accent border-accent bg-[var(--movie-accent)]' : ''}
                        >
                            <Link to="/search">
                                <Search size={17} />
                            </Link>
                        </Button>

                        {/* Wishlist with count badge */}
                        <div className="relative hidden sm:block">
                            <Button variant="icon" size="icon-sm" asChild>
                                <Link to="/collection">
                                    <Heart size={17} />
                                </Link>
                            </Button>
                            {wishlist.length > 0 && (
                                <Badge
                                    variant="default"
                                    className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] text-[9px] px-1 rounded-full flex items-center justify-center"
                                >
                                    {wishlist.length}
                                </Badge>
                            )}
                        </div>

                        {/* Bell */}
                        <Button variant="icon" size="icon-sm" className="hidden sm:flex">
                            <Bell size={17} />
                        </Button>

                        {/* Theme toggle */}
                        <Button
                            variant="icon"
                            size="icon-sm"
                            onClick={toggleTheme}
                            className="text-accent bg-[var(--movie-accent)] border-accent/40 hover:rotate-12"
                            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                        >
                            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                        </Button>

                        {/* User */}
                        <Button
                            variant="gradient"
                            size="icon-sm"
                            className="hidden sm:flex"
                        >
                            <User size={17} />
                        </Button>

                        {/* Mobile hamburger */}
                        <Button
                            variant="icon"
                            size="icon-sm"
                            className="md:hidden"
                            onClick={() => setMobileOpen(o => !o)}
                        >
                            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
                        </Button>
                    </div>
                </div>

                {/* ── Mobile menu ── */}
                <div
                    className="md:hidden mx-2 mt-2 rounded-2xl overflow-hidden transition-all duration-400"
                    style={{
                        maxHeight: mobileOpen ? '300px' : '0',
                        opacity: mobileOpen ? 1 : 0,
                        background: 'var(--nav-bg)',
                        backdropFilter: 'blur(24px)',
                        border: mobileOpen ? '1px solid var(--glass-border)' : '1px solid transparent',
                    }}
                >
                    <div className="flex flex-col p-3 gap-1">
                        {links.map(item => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                                style={{
                                    background: isActive(item.path) ? 'var(--movie-accent)' : 'transparent',
                                    color: isActive(item.path) ? 'var(--accent)' : 'var(--muted-foreground)',
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
}