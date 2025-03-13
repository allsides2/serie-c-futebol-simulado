
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Video } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type YouTubeVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount?: string;
};

const YouTubeLatestVideos = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      setLoading(true);
      try {
        // Fetch data from YouTube API
        // For now, we'll show simulated data
        const simulatedVideos = await simulateYouTubeAPICall();
        setVideos(simulatedVideos);
        setError(null);
      } catch (err) {
        console.error("Error fetching YouTube videos:", err);
        setError("Não foi possível carregar os vídeos do canal");
        toast({
          title: "Erro ao carregar vídeos",
          description: "Não foi possível obter os últimos vídeos do canal.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeVideos();
  }, [toast]);

  // This function simulates a YouTube API call with recent videos from the channel
  const simulateYouTubeAPICall = (): Promise<YouTubeVideo[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "vid1",
            title: "Análise Tática: Figueirense 2 x 0 Brusque - A estratégia perfeita",
            thumbnail: "https://i.ytimg.com/vi/6wjUlZAdqZM/maxresdefault.jpg",
            publishedAt: "2 dias atrás",
            viewCount: "2.7K"
          },
          {
            id: "vid2",
            title: "MEMÓRIA ALVINEGRA: Figueirense 3x0 Avaí - Campeonato Catarinense 2023",
            thumbnail: "https://i.ytimg.com/vi/Utu-HdTe6ss/maxresdefault.jpg",
            publishedAt: "5 dias atrás",
            viewCount: "3.2K"
          },
          {
            id: "vid3",
            title: "Bastidores | Figueirense se prepara para a Série C 2025",
            thumbnail: "https://i.ytimg.com/vi/4CQm6_SZZQw/maxresdefault.jpg",
            publishedAt: "1 semana atrás",
            viewCount: "4.1K"
          }
        ]);
      }, 1500);
    });
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-figueira-black rounded-full mr-2"></div>
            <h2 className="text-2xl font-bold">Vídeos Recentes</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((placeholder) => (
            <Card key={placeholder} className="overflow-hidden border-none shadow animate-pulse">
              <div className="bg-gray-300 h-48 w-full"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <div className="w-1.5 h-6 bg-figueira-black rounded-full mr-2"></div>
            <h2 className="text-2xl font-bold">Vídeos Recentes</h2>
          </div>
        </div>
        <Card className="p-6 text-center border-red-200 bg-red-50">
          <p className="text-red-600 mb-4">Não foi possível carregar os vídeos do canal.</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mx-auto"
          >
            Tentar Novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center mb-6 justify-between">
        <div className="flex items-center">
          <div className="w-1.5 h-6 bg-figueira-black rounded-full mr-2"></div>
          <h2 className="text-2xl font-bold">Vídeos Recentes</h2>
        </div>
        <a 
          href="https://www.youtube.com/@MemoriasFigueirense/videos" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center text-figueira-black hover:text-figueira-gray"
        >
          <Button variant="ghost" className="text-figueira-black hover:text-figueira-gray">
            Ver Todos <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-md transition group border-none shadow">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.viewCount} visualizações
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-3 left-3 flex items-center">
                <div className="bg-red-600 rounded-full p-1.5 mr-2">
                  <Video className="h-4 w-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">{video.publishedAt}</span>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-figueira-black transition-colors">
                {video.title}
              </h3>
              <div className="flex justify-end mt-3">
                <a 
                  href={`https://www.youtube.com/watch?v=${video.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" className="border-figueira-black text-figueira-black hover:bg-figueira-black hover:text-white">
                    Assistir Agora
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default YouTubeLatestVideos;
