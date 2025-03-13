
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Users, Trophy, Calendar, Star, Link2 } from "lucide-react";
import Simulator from './Simulator';
import { useToast } from "@/components/ui/use-toast";
import YouTubeLatestVideos from './YouTubeLatestVideos';

const MainPage = () => {
  const [subscribers, setSubscribers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // In a real implementation, this would use the YouTube API
        // For demonstration purposes, we're simulating an API call
        const randomChange = Math.floor(Math.random() * 5) - 2; // Random number between -2 and 2
        setSubscribers(prev => prev === null ? 1450 : prev + randomChange);
        setLoading(false);
      } catch (err) {
        setError('Não foi possível carregar o número de inscritos');
        setLoading(false);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível obter o número de inscritos do canal.",
          variant: "destructive"
        });
      }
    };

    fetchSubscribers();
    
    // Update subscriber count every 30 seconds to simulate real-time changes
    const intervalId = setInterval(fetchSubscribers, 30 * 1000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  const stats = [
    { title: 'Fundação', value: '1921', icon: <Calendar className="h-5 w-5 text-figueira-black" /> },
    { title: 'Títulos Estaduais', value: '18', icon: <Trophy className="h-5 w-5 text-figueira-black" /> },
    { title: 'Maior Artilheiro', value: 'Fernandes', icon: <Star className="h-5 w-5 text-figueira-black" /> },
    { title: 'Estádio', value: 'Orlando Scarpelli', icon: <Link2 className="h-5 w-5 text-figueira-black" /> },
  ];

  return (
    <div className="py-8">
      {/* Hero Section with Live Subscriber Count */}
      <div className="relative w-full h-80 md:h-96 rounded-lg overflow-hidden mb-10">
        <img 
          src="https://images.unsplash.com/photo-1540293923757-55566bf01c3d?q=80&w=1920&auto=format&fit=crop"
          alt="Figueirense FC" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-figueira-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <div className="flex items-center mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Figueirense_FC_logo.svg/1200px-Figueirense_FC_logo.svg.png" 
              alt="Escudo do Figueirense" 
              className="w-16 h-16 mr-4"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Canal Figueiraço</h1>
              <p className="text-gray-200">Tudo sobre o Figueirense na Série C 2025</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <a 
              href="https://www.youtube.com/@MemoriasFigueirense" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <Youtube className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">@MemoriasFigueirense</span>
            </a>
            
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full relative overflow-hidden">
              <Users className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium relative z-10">
                {loading ? 'Carregando...' : error ? 'Erro' : `${subscribers?.toLocaleString()} inscritos`}
              </span>
              {!loading && !error && (
                <div className="absolute bottom-0 left-0 h-full bg-gradient-to-r from-green-500/30 to-green-500/10 w-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Insert Simulator (separated from MainPage) */}
      <Simulator />

      {/* About Section with Improved Design */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-figueira-black rounded-full mr-2"></div>
          <h2 className="text-2xl font-bold">Sobre o Canal</h2>
        </div>
        <Card className="overflow-hidden border-none shadow-lg">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-gradient-to-br from-figueira-black to-figueira-gray p-8 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                  Nossa História
                </h3>
                <p className="text-gray-300 mb-4">
                  Bem-vindo ao Canal Figueiraço, seu destino para tudo sobre o Figueirense FC! 
                  Aqui você encontra análises táticas, notícias, discussões e toda a cobertura da 
                  campanha do Furacão do Estreito na Série C do Campeonato Brasileiro 2025.
                </p>
                <p className="text-gray-300 mb-6">
                  De torcedor para torcedor, nosso objetivo é manter viva a paixão pelo Figueira 
                  e acompanhar de perto a jornada rumo à Série B.
                </p>
                <Button className="mt-2 bg-red-600 hover:bg-red-700 border-none">
                  <Youtube className="mr-2" /> Inscrever-se
                </Button>
              </div>
              <div className="p-8 bg-white">
                <h3 className="text-xl font-bold mb-4 text-figueira-black flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  Estatísticas do Clube
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition">
                      <div className="bg-gray-100 p-2 rounded-full mb-2">
                        {stat.icon}
                      </div>
                      <h3 className="text-lg font-bold">{stat.value}</h3>
                      <p className="text-gray-500 text-sm">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos Section - Now using the YouTubeLatestVideos component */}
      <YouTubeLatestVideos />

      {/* Footer CTA with Improved Design */}
      <Card className="bg-gradient-to-r from-figueira-light-gray to-white border-none shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="mb-4 relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-figueira-black via-gray-500 to-figueira-black rounded-full blur opacity-30"></div>
            <div className="relative bg-white rounded-full p-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Figueirense_FC_logo.svg/1200px-Figueirense_FC_logo.svg.png" 
                alt="Escudo do Figueirense" 
                className="w-16 h-16 mx-auto"
              />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Participe da nossa comunidade!</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Junte-se a milhares de torcedores apaixonados do Figueirense FC. 
            Inscreva-se no canal e não perca nenhuma atualização!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href="https://www.youtube.com/@MemoriasFigueirense?sub_confirmation=1" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="bg-red-600 hover:bg-red-700">
                <Youtube className="mr-2" /> Inscrever-se no Canal
              </Button>
            </a>
            <a 
              href="https://www.youtube.com/@MemoriasFigueirense/community" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-figueira-black text-figueira-black hover:bg-figueira-black hover:text-white">
                <Users className="mr-2" /> Comunidade
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
