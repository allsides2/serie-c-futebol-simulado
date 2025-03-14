
import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateCustomFormation } from '@/utils/playerUtils';
import { Formation } from '@/pages/LineupBuilder';
import { AlertCircle, Check, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface CustomFormationProps {
  onFormationSubmit: (formation: string) => void;
}

interface PositionDot {
  id: number;
  x: number;
  y: number;
  group: 'defenders' | 'midfielders' | 'attackers';
}

const CustomFormation: React.FC<CustomFormationProps> = ({ onFormationSubmit }) => {
  const { toast } = useToast();
  const [customFormation, setCustomFormation] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isDraggingMode, setIsDraggingMode] = useState(false);
  const [positions, setPositions] = useState<PositionDot[]>([]);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<number | null>(null);
  
  const validateInput = (input: string) => {
    setCustomFormation(input);
    if (input.length === 0) {
      setIsValid(null);
      return;
    }
    setIsValid(validateCustomFormation(input));
  };
  
  const handleSubmit = () => {
    if (isValid) {
      onFormationSubmit(customFormation);
      toast({
        title: "Esquema tático personalizado",
        description: `Esquema ${customFormation} aplicado com sucesso!`,
      });
    } else {
      toast({
        title: "Esquema inválido",
        description: "O esquema deve ser no formato X-X-X e somar 10 jogadores (ex: 4-3-3)",
        variant: "destructive",
      });
    }
  };

  const generateDots = () => {
    if (!validateCustomFormation(customFormation)) return;

    const [defenders, midfielders, attackers] = customFormation.split('-').map(n => parseInt(n, 10));
    const newPositions: PositionDot[] = [];
    
    // Defenders (bottom third)
    for (let i = 0; i < defenders; i++) {
      newPositions.push({
        id: i,
        x: (i + 1) * (100 / (defenders + 1)),
        y: 70,
        group: 'defenders'
      });
    }
    
    // Midfielders (middle third)
    for (let i = 0; i < midfielders; i++) {
      newPositions.push({
        id: defenders + i,
        x: (i + 1) * (100 / (midfielders + 1)),
        y: 45,
        group: 'midfielders'
      });
    }
    
    // Attackers (top third)
    for (let i = 0; i < attackers; i++) {
      newPositions.push({
        id: defenders + midfielders + i,
        x: (i + 1) * (100 / (attackers + 1)),
        y: 20,
        group: 'attackers'
      });
    }
    
    setPositions(newPositions);
    setIsDraggingMode(true);
  };

  const handleFieldClick = (e: React.MouseEvent) => {
    if (!isDraggingMode || !activeDot) return;
    
    const field = fieldRef.current;
    if (!field) return;
    
    const rect = field.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPositions(prev => 
      prev.map(dot => 
        dot.id === activeDot ? { ...dot, x, y } : dot
      )
    );
  };

  const handleDotSelect = (id: number) => {
    setActiveDot(id === activeDot ? null : id);
  };

  const moveDot = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (activeDot === null) return;
    
    setPositions(prev => 
      prev.map(dot => {
        if (dot.id === activeDot) {
          const step = 5;
          switch (direction) {
            case 'up': return { ...dot, y: Math.max(0, dot.y - step) };
            case 'down': return { ...dot, y: Math.min(100, dot.y + step) };
            case 'left': return { ...dot, x: Math.max(0, dot.x - step) };
            case 'right': return { ...dot, x: Math.min(100, dot.x + step) };
            default: return dot;
          }
        }
        return dot;
      })
    );
  };

  const calculateFormationFromPositions = () => {
    // Group by y-position into three bands
    const groupedByHeight = positions.reduce((acc: Record<string, PositionDot[]>, pos) => {
      let band;
      if (pos.y < 33) band = 'attackers';
      else if (pos.y < 66) band = 'midfielders';
      else band = 'defenders';
      
      if (!acc[band]) acc[band] = [];
      acc[band].push(pos);
      return acc;
    }, {});
    
    const defenders = groupedByHeight['defenders']?.length || 0;
    const midfielders = groupedByHeight['midfielders']?.length || 0;
    const attackers = groupedByHeight['attackers']?.length || 0;
    
    const formation = `${defenders}-${midfielders}-${attackers}`;
    setCustomFormation(formation);
    setIsValid(validateCustomFormation(formation));
    return formation;
  };

  const applyCustomPositions = () => {
    const formation = calculateFormationFromPositions();
    if (validateCustomFormation(formation)) {
      onFormationSubmit(formation);
      toast({
        title: "Esquema tático personalizado",
        description: `Esquema ${formation} aplicado com sucesso!`,
      });
      setIsDraggingMode(false);
    } else {
      toast({
        title: "Formação inválida",
        description: "A distribuição dos jogadores deve somar 10 (ex: 4-3-3)",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-2">
      {!isDraggingMode ? (
        <>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                placeholder="Ex: 4-3-3"
                value={customFormation}
                onChange={(e) => validateInput(e.target.value)}
                className={`pr-8 ${
                  isValid === true ? 'border-green-500' : 
                  isValid === false ? 'border-red-500' : ''
                }`}
              />
              {isValid !== null && (
                <div className="absolute right-2 top-2.5">
                  {isValid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={!isValid}
              className="bg-figueira-black hover:bg-figueira-black/90"
            >
              Aplicar
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Digite um esquema no formato X-X-X que some 10 jogadores. Ex: 4-3-3, 3-5-2, etc.
            </p>
            {isValid && (
              <Button 
                onClick={generateDots} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Ajustar manualmente
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-3">
              <div 
                ref={fieldRef}
                onClick={handleFieldClick}
                className="relative bg-gradient-to-b from-green-500 to-green-600 w-full h-[200px] rounded-lg overflow-hidden border-2 border-white shadow-md cursor-pointer"
              >
                {/* Field markings */}
                <div className="absolute w-full h-full border-2 border-white/70"></div>
                <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-white/70"></div>
                <div className="absolute rounded-full w-[20%] h-[20%] border-2 border-white/70 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Position dots */}
                {positions.map((dot) => (
                  <div
                    key={dot.id}
                    className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                      activeDot === dot.id 
                        ? 'bg-amber-500 ring-2 ring-white scale-125' 
                        : dot.group === 'defenders' 
                          ? 'bg-blue-500' 
                          : dot.group === 'midfielders' 
                            ? 'bg-green-700' 
                            : 'bg-red-500'
                    }`}
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDotSelect(dot.id);
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-medium text-center mb-1">Mover selecionado</div>
              <div className="grid grid-cols-3 gap-1">
                <div></div>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="w-8 h-8" 
                  onClick={() => moveDot('up')}
                  disabled={activeDot === null}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <div></div>
                
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="w-8 h-8" 
                  onClick={() => moveDot('left')}
                  disabled={activeDot === null}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div></div>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="w-8 h-8" 
                  onClick={() => moveDot('right')}
                  disabled={activeDot === null}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <div></div>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="w-8 h-8" 
                  onClick={() => moveDot('down')}
                  disabled={activeDot === null}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <div></div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex space-y-0 space-x-1 items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="text-xs">Defensores</div>
              </div>
              <div className="flex space-y-0 space-x-1 items-center">
                <div className="w-3 h-3 rounded-full bg-green-700"></div>
                <div className="text-xs">Meio-campistas</div>
              </div>
              <div className="flex space-y-0 space-x-1 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="text-xs">Atacantes</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="w-1/2" 
              onClick={() => setIsDraggingMode(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="w-1/2 bg-figueira-black hover:bg-figueira-black/90" 
              onClick={applyCustomPositions}
            >
              Aplicar Posições
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomFormation;
