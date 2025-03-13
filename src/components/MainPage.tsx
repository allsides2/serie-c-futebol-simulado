
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, Users, Trophy, Calendar, Star, Video, Link2, ArrowRight } from "lucide-react";

const MainPage = () => {
  const [subscribers, setSubscribers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // Fetch subscriber count using YouTube API
        // Note: In a real implementation, this would use the YouTube API
        // For now, we'll simulate a subscriber count since we can't make API calls directly
        setTimeout(() => {
          // Simulated subscriber count - replace with real API call when possible
          setSubscribers(1450);
          setLoading(false);
        }, 1500);
      } catch (err) {
        setError('Não foi possível carregar o número de inscritos');
        setLoading(false);
      }
    };

    fetchSubscribers();
    
    // Refresh subscriber count every 5 minutes
    const intervalId = setInterval(fetchSubscribers, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const videos = [
    {
      id: 1,
      title: 'Melhores Momentos: Figueirense 3 x 0 Brusque',
      thumbnail: 'https://images.unsplash.com/photo-1562552052-296a66888f38?w=500&h=280&fit=crop',
      views: '2.3K',
      date: '2 dias atrás',
    },
    {
      id: 2,
      title: 'Análise Tática: Como o Figueirense deve jogar na Série C',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0c?w=500&h=280&fit=crop',
      views: '1.8K',
      date: '5 dias atrás',
    },
    {
      id: 3,
      title: 'Reforços para 2025: Quem vem aí?',
      thumbnail: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=500&h=280&fit=crop',
      views: '3.1K',
      date: '1 semana atrás',
    }
  ];

  const stats = [
    { title: 'Fundação', value: '1921', icon: <Calendar className="h-5 w-5 text-figueira-black" /> },
    { title: 'Títulos Estaduais', value: '18', icon: <Trophy className="h-5 w-5 text-figueira-black" /> },
    { title: 'Maior Artilheiro', value: 'Fernandes', icon: <Star className="h-5 w-5 text-figueira-black" /> },
    { title: 'Estádio', value: 'Orlando Scarpelli', icon: <Link2 className="h-5 w-5 text-figueira-black" /> },
  ];

  return (
    <div className="py-8">
      {/* Hero Section */}
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
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Youtube className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-white font-medium">@MemoriasFigueirense</span>
            </div>
            
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Users className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">
                {loading ? 'Carregando...' : error ? 'Erro' : `${subscribers?.toLocaleString()} inscritos`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-figueira-black rounded-full mr-2"></div>
          <h2 className="text-2xl font-bold">Sobre o Canal</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700 mb-4">
                  Bem-vindo ao Canal Figueiraço, seu destino para tudo sobre o Figueirense FC! 
                  Aqui você encontra análises táticas, notícias, discussões e toda a cobertura da 
                  campanha do Furacão do Estreito na Série C do Campeonato Brasileiro 2025.
                </p>
                <p className="text-gray-700 mb-4">
                  De torcedor para torcedor, nosso objetivo é manter viva a paixão pelo Figueira 
                  e acompanhar de perto a jornada rumo à Série B.
                </p>
                <Button className="mt-2 bg-figueira-black hover:bg-figueira-gray">
                  Inscrever-se <Youtube className="ml-1" />
                </Button>
              </div>
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
          </CardContent>
        </Card>
      </div>

      {/* Videos Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-figueira-black rounded-full mr-2"></div>
            <h2 className="text-2xl font-bold">Vídeos Recentes</h2>
          </div>
          <Button variant="ghost" className="text-figueira-black hover:text-figueira-gray">
            Ver Todos <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-md transition">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.views} visualizações
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-1" />
                    <span>{video.date}</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-figueira-black text-figueira-black hover:bg-figueira-black hover:text-white">
                    Assistir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Simulador Promo */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-figueira-black rounded-full mr-2"></div>
          <h2 className="text-2xl font-bold">Simulador da Série C</h2>
        </div>
        <Card className="bg-gradient-to-r from-figueira-black to-figueira-gray text-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Simule os Resultados!</h3>
                <p className="mb-6 text-gray-300">
                  Use nosso simulador exclusivo para prever resultados, criar cenários e acompanhar 
                  a trajetória do Figueirense rumo ao acesso para a Série B do Brasileirão.
                </p>
                <Button className="bg-white text-figueira-black hover:bg-gray-100">
                  Acessar Simulador <ArrowRight className="ml-1" />
                </Button>
              </div>
              <div className="relative h-48 md:h-64">
                <img 
                  src="https://images.unsplash.com/photo-1574629193679-62cdc1568a56?w=500&auto=format&fit=crop" 
                  alt="Simulador da Série C" 
                  className="rounded-lg w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-figueira-black text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                  Exclusivo
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer CTA */}
      <Card className="bg-gray-100 border-none">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Figueirense_FC_logo.svg/1200px-Figueirense_FC_logo.svg.png" 
              alt="Escudo do Figueirense" 
              className="w-16 h-16 mx-auto"
            />
          </div>
          <h3 className="text-xl font-bold mb-2">Participe da nossa comunidade!</h3>
          <p className="text-gray-600 mb-4">
            Junte-se a milhares de torcedores apaixonados do Figueirense FC. 
            Inscreva-se no canal e não perca nenhuma atualização!
          </p>
          <Button className="bg-red-600 hover:bg-red-700">
            <Youtube className="mr-2" /> Inscrever-se no Canal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainPage;
