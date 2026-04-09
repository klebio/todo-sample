import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Map as MapIcon, 
  User, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Irmandade', path: '/members' },
    { icon: <MapIcon size={20} />, label: 'Rotas', path: '/routes' },
    { icon: <User size={20} />, label: 'Meu Perfil', path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
          Los Motokas <span className="text-[#4B5320]">MC</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold uppercase text-xs tracking-widest",
              location.pathname === item.path 
                ? "bg-[#4B5320] text-white shadow-lg shadow-[#4B5320]/20" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all font-bold uppercase text-xs tracking-widest"
        >
          <LogOut size={20} />
          Abandonar QG
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;