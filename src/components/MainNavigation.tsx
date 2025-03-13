
import React from 'react';
import { Home, Activity, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const MainNavigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // For mobile navigation toggle
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  isActive('/') && "bg-figueira-accent text-white"
                )}>
                  <Home className="mr-2 h-4 w-4" />
                  Início
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/matches">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  isActive('/matches') && "bg-figueira-accent text-white"
                )}>
                  <Activity className="mr-2 h-4 w-4" />
                  Simulador
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex">
        <Button 
          variant="ghost" 
          className="p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        {isMenuOpen && (
          <div className="absolute top-16 right-0 left-0 bg-white shadow-lg z-50 p-4 rounded-b-lg mx-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={cn(
                    "flex items-center p-2 rounded-lg",
                    isActive('/') ? "bg-figueira-accent text-white" : "hover:bg-gray-100"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Início
                </Link>
              </li>
              <li>
                <Link 
                  to="/matches" 
                  className={cn(
                    "flex items-center p-2 rounded-lg",
                    isActive('/matches') ? "bg-figueira-accent text-white" : "hover:bg-gray-100"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Activity className="mr-2 h-5 w-5" />
                  Simulador
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default MainNavigation;
