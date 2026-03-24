import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAppOverview } from '../redux/pokemon/selectors';

const Navigation = () => {
  const location = useLocation();
  const appOverview = useSelector(selectAppOverview);

  const navItems = [
    { path: '/', label: 'Buscar', icon: '🔍' },
    { path: '/list', label: 'Lista', icon: '📋' },
    { path: '/favorites', label: `Favoritos (${appOverview.totalFavorites})`, icon: '❤️' },
    { path: '/battle', label: 'Batalha', icon: '⚔️' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🎮 Pokédex Redux
        </Link>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
