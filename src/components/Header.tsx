
import { Trophy } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-brasil-green text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Série C 2025</h1>
        </div>
        <div className="text-sm md:text-base">
          <p>Simulador do Campeonato Brasileiro</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
