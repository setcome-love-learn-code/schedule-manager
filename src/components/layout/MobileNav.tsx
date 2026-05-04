import { NavLink } from 'react-router-dom';

const mobileNavItems = [
  { path: '/', label: '首页', icon: '📊' },
  { path: '/tasks', label: '任务', icon: '✅' },
  { path: '/calendar', label: '日历', icon: '📅' },
  { path: '/settings', label: '设置', icon: '⚙️' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`
          }
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
