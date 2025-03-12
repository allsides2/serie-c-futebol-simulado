
import { FootballProvider } from '@/context/FootballContext';
import Header from '@/components/Header';
import TabMenu from '@/components/TabMenu';

const Index = () => {
  return (
    <FootballProvider>
      <div className="flex flex-col min-h-screen bg-figueira-light-gray">
        <Header />
        <main className="flex-1 pb-10">
          <TabMenu />
        </main>
        <footer className="bg-figueira-black text-figueira-white p-4 text-center">
          <div className="container mx-auto">
            <p className="text-sm">Simulador da Série C do Campeonato Brasileiro 2025</p>
            <p className="text-xs mt-1">Figueaço - Canal de Torcedores do Figueirense</p>
          </div>
        </footer>
      </div>
    </FootballProvider>
  );
};

export default Index;
