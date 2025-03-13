
import { Link } from 'react-router-dom';
import MainNavigation from './MainNavigation';

const Header = () => {
  return (
    <header className="bg-figueira-black text-figueira-white py-3 px-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Figueiraço" className="h-8" />
          <span className="font-bold text-xl">Figueiraço</span>
        </Link>
        
        <MainNavigation />
      </div>
    </header>
  );
};

export default Header;
