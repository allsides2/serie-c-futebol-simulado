
import { FootballProvider } from '@/context/FootballContext';
import Header from '@/components/Header';
import TabMenu from '@/components/TabMenu';

const Index = () => {
  return (
    <FootballProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 pb-10">
          <TabMenu />
        </main>
        <footer className="bg-brasil-green text-white p-4 text-center">
          <p className="text-sm">Simulador da Série C do Campeonato Brasileiro 2025</p>
        </footer>
      </div>
    </FootballProvider>
  );
};

export default Index;
