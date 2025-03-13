
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Simulator = () => {
  return (
    <Card className="bg-gradient-to-r from-figueira-black to-figueira-gray text-white overflow-hidden mb-6">
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
  );
};

export default Simulator;
