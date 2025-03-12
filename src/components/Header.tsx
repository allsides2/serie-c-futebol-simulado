import { Trophy, Heart, Star } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-figueira-black text-figueira-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center bg-figueira-white rounded-full p-1 mr-1">
            <Trophy className="h-7 w-7 text-figueira-black" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Série C 2025</h1>
            <p className="text-xs md:text-sm text-gray-300">Canal Figueaço</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center group px-3 py-1 rounded-lg bg-figueira-white/10 hover:bg-figueira-white/20 transition-colors">
            <Star className="h-4 w-4 mr-1 text-figueira-white opacity-60 group-hover:opacity-100" />
            <span className="text-sm font-bold text-figueira-white opacity-60 group-hover:opacity-100">Figueirense FC</span>
          </div>
          <div className="hidden md:block text-sm md:text-base">
            <p>Simulador do Campeonato Brasileiro</p>
          </div>
          <Heart className="h-5 w-5 text-figueira-white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
