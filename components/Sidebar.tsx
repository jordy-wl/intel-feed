import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Reports', path: '/reports', icon: '📄' },
    { name: 'Chat Assistant', path: '/chat', icon: '💬' },
    { name: 'RSS Feeds', path: '/feeds', icon: '📡' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-gray-950 border-r border-gray-800 flex-shrink-0 flex flex-col justify-between">
      <div>
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-800">
          <span className="text-2xl mr-2">🧠</span>
          <span className="hidden lg:block font-bold text-xl tracking-wide text-indigo-400">IntellectFeed</span>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg transition-colors duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-xl lg:mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="hidden lg:block font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800">
         <div className="hidden lg:block text-xs text-gray-500 text-center">
            v1.0.0 Alpha
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;