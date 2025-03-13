
import { FootballProvider } from '@/context/FootballContext';
import Header from '@/components/Header';
import TabMenu from '@/components/TabMenu';
import { Toaster } from "@/components/ui/toaster";

const MatchSimulator = () => {
  return (
    <FootballProvider>
      <div className="flex flex-col min-h-screen bg-figueira-light-gray">
        <Header />
        <div className="absolute inset-0 z-0 figueira-pattern pointer-events-none"></div>
        <main className="flex-1 pb-10 relative z-10">
          <div className="container mx-auto mt-4 px-4">
            <div className="bg-figueira-black text-figueira-white py-2 px-4 rounded-md mb-4">
              <h2 className="text-lg font-bold">Simulador Figueiraço</h2>
            </div>
            
            {/* Main simulator content */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Como usar o simulador</h3>
              <p className="mb-4">
                O Simulador Figueiraço permite que você preveja os resultados das partidas da Série C 
                e acompanhe como o Figueirense pode se classificar para a próxima fase.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-bold text-lg mb-2">Simulação de Resultados</h4>
                  <p>
                    Use nossa ferramenta para simular os resultados das partidas e veja como isso afeta a classificação 
                    geral do Figueirense na tabela da Série C.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="font-bold text-lg mb-2">Cenários de Classificação</h4>
                  <p>
                    Descubra quais resultados são necessários para o Figueirense garantir sua vaga na 
                    próxima fase da competição.
                  </p>
                </div>
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

export default MatchSimulator;
