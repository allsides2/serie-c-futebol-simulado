
import { FootballProvider } from '@/context/FootballContext';
import Header from '@/components/Header';
import TabMenu from '@/components/TabMenu';
import { Toaster } from "@/components/ui/toaster";
import { Star } from "lucide-react";

const Index = () => {
  return (
    <FootballProvider>
      <div className="flex flex-col min-h-screen bg-figueira-light-gray">
        <Header />
        <div className="absolute inset-0 z-0 figueira-pattern pointer-events-none"></div>
        <main className="flex-1 pb-10 relative z-10">
          <div className="container mx-auto mt-4 px-4">
            <div className="bg-figueira-black text-figueira-white py-2 px-4 rounded-md mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Simulador Figueaço</h2>
              <div className="flex items-center group px-2 py-1 rounded-md transition-colors hover:bg-white/10">
                <Star className="h-4 w-4 mr-1 text-figueira-white opacity-60 group-hover:opacity-100" />
                <span className="text-sm text-figueira-white opacity-60 group-hover:opacity-100">Destaque: Figueirense</span>
              </div>
            </div>
          </div>
          <TabMenu />
        </main>
        <footer className="bg-figueira-black text-figueira-white p-4 text-center relative z-10">
          <div className="container mx-auto">
            <p className="text-sm">Simulador da Série C do Campeonato Brasileiro 2025</p>
            <p className="text-xs mt-1">Figueaço - Canal de Torcedores do Figueirense</p>
          </div>
        </footer>
        <Toaster />
      </div>
    </FootballProvider>
  );
};

export default Index;
