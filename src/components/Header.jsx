import { useRef, useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Gauge, Menu, X } from 'lucide-react';
import useMagnetic from '../hooks/useMagnetic.js';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/corners', label: '弯角列表' },
  { to: '/brands', label: '品牌故事' },
  { to: '/lap-times', label: '圈速档案' }
];

function MagneticNavLink({ to, label }) {
  const magnetic = useMagnetic(0.25, 60);
  return (
    <NavLink to={to} {...magnetic}>
      {label}
    </NavLink>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const closeButtonRef = useRef(null);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Move focus into the drawer when it opens and support Escape to close.
  useEffect(() => {
    if (!isOpen) return undefined;

    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header">
      <Link className="brand-mark" to="/" aria-label="返回首页">
        <span className="brand-icon">
          <Gauge size={20} />
        </span>
        <span>
          <strong>Nordschleife</strong>
          <small>绿色地狱弯角档案</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="主导航">
        {navItems.map((item) => (
          <MagneticNavLink key={item.to} to={item.to} label={item.label} />
        ))}
      </nav>

      <div className="mobile-nav-container">
        <button
            className="mobile-nav-trigger"
            aria-label={isOpen ? '关闭导航' : '打开导航'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
          <Menu size={22} />
        </button>

        {isOpen && (
          <div className="mobile-nav-backdrop" onClick={() => setIsOpen(false)} aria-hidden="true" />
        )}
        
        <nav
            className={`mobile-nav-drawer ${isOpen ? 'is-open' : ''}`}
            aria-label="移动端主导航"
            aria-hidden={isOpen ? undefined : 'true'}
            inert={isOpen ? undefined : true}
          >
          <div className="mobile-nav-drawer-header">
            <span className="brand-icon">
              <Gauge size={20} />
            </span>
            <button ref={closeButtonRef} aria-label="关闭导航" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="mobile-nav-drawer-links">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
