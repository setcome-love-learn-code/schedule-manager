import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { useAppContext } from '../../hooks/useAppContext';
import '../../styles/layout.css';

export default function AppLayout() {
  const { state } = useAppContext();
  const sidebarOpen = state.ui.sidebarOpen;

  return (
    <div className="layout">
      <Sidebar />
      <div className={`layout-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header />
        <main className="layout-content">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
