import { Link, useLocation } from "react-router-dom";
import { Activity, MapPin, LayoutDashboard, LogIn, Zap, PlusCircle, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("hospitalLoggedIn") === "true");

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(localStorage.getItem("hospitalLoggedIn") === "true");
    };
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("hospitalAuthChange", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("hospitalAuthChange", handleAuthChange);
    };
  }, []);

  const links = [
    { to: "/", label: "Home", icon: Activity },
    { to: "/map", label: "Find Hospitals", icon: MapPin },
    { to: "/admin", label: isLoggedIn ? "Update Info" : "Admin", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Medi<span className="text-gradient">Flow</span> AI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/map">
            <Button size="sm" className="gradient-hero text-primary-foreground border-0 gap-2">
              <Zap className="w-4 h-4" />
              Find Fastest Hospital
            </Button>
          </Link>
          {isLoggedIn ? (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <Building className="w-4 h-4" />
                Your Hospital
              </Button>
            </Link>
          ) : (
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="w-4 h-4" />
                Hospital Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="w-5 h-5 flex flex-col justify-center gap-1">
            <span className={`block h-0.5 w-5 bg-foreground transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-foreground transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
          <Link to="/map" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full mt-2 gradient-hero text-primary-foreground border-0 gap-2">
              <Zap className="w-4 h-4" />
              Find Fastest Hospital
            </Button>
          </Link>
          {isLoggedIn ? (
            <Link to="/admin" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                <Building className="w-4 h-4" />
                Your Hospital
              </Button>
            </Link>
          ) : (
            <Link to="/admin" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                <LogIn className="w-4 h-4" />
                Hospital Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
