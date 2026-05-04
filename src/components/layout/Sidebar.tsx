import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';

const navItems = [
  { path: '/', label: '仪表盘', icon: '📊' },
  { path: '/tasks', label: '任务', icon: '✅' },
  { path: '/learning', label: '学习', icon: '📚' },
  { path: '/projects', label: '项目', icon: '📋' },
  { path: '/calendar', label: '日历', icon: '📅' },
  { path: '/settings', label: '设置', icon: '⚙️' },
];

export default function Sidebar() {
  const { state, dispatch } = useAppContext();
  const isOpen = state.ui.sidebarOpen;

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">日程管理</h2>
        <button
          className="sidebar-close"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label="Close sidebar"
        >
          ×
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
            onClick={() => {
              if (window.innerWidth <= 768) {
                dispatch({ type: 'TOGGLE_SIDEBAR' });
              }
            }}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
