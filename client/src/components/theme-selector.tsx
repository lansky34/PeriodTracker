import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Palette, Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { ProFeatureGate } from '@/components/pro-feature-gate';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const { currentTheme, availableThemes, changeTheme, isPro } = useTheme();

  const handleThemeChange = (themeId: string) => {
    const success = changeTheme(themeId);
    if (!success) {
      // Theme change was blocked (Pro required)
      console.log('Theme change blocked - Pro required');
    }
  };

  // Separate free and pro themes
  const freeThemes = availableThemes.filter(theme => !theme.isPro);
  const proThemes = availableThemes.filter(theme => theme.isPro);

  const ThemePreview = ({ theme }: { theme: any }) => (
    <div
      className={cn(
        "relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
        currentTheme?.id === theme.id ? "border-primary ring-2 ring-primary/20" : "border-border"
      )}
      onClick={() => handleThemeChange(theme.id)}
    >
      {theme.isPro && (
        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
          Pro
        </Badge>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-sm">{theme.name}</h4>
          <p className="text-xs text-muted-foreground">{theme.description}</p>
        </div>
        {currentTheme?.id === theme.id && (
          <Check className="w-4 h-4 text-primary" />
        )}
      </div>

      {/* Theme Color Preview */}
      <div className="flex space-x-1">
        <div 
          className="w-6 h-6 rounded-sm border" 
          style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
        />
        <div 
          className="w-6 h-6 rounded-sm border" 
          style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
        />
        <div 
          className="w-6 h-6 rounded-sm border" 
          style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
        />
        <div 
          className="w-6 h-6 rounded-sm border" 
          style={{ backgroundColor: `hsl(${theme.colors.muted})` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Palette className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Custom Themes</h3>
        {isPro && (
          <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Pro Active
          </Badge>
        )}
      </div>

      {/* Free Themes */}
      <div>
        <h4 className="text-sm font-medium mb-3">Available Themes</h4>
        <div className="grid grid-cols-1 gap-3">
          {freeThemes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme} />
          ))}
        </div>
      </div>

      {/* Pro Themes */}
      {proThemes.length > 0 && (
        <ProFeatureGate
          feature="Premium Themes"
          description="Unlock beautiful custom themes with unique color palettes designed for a personalized experience."
          fallback={
            <div>
              <div className="flex items-center mb-3">
                <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                <h4 className="text-sm font-medium">Premium Themes</h4>
                <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  Pro Only
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 gap-3 opacity-60">
                {proThemes.slice(0, 2).map((theme) => (
                  <div key={theme.id} className="relative">
                    <ThemePreview theme={theme} />
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                        <p className="text-sm font-medium">Pro Theme</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center p-4 border-2 border-dashed border-amber-300 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                  <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                    +{proThemes.length - 2} more premium themes
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Upgrade to Pro to unlock all themes
                  </p>
                </div>
              </div>
            </div>
          }
        >
          <div>
            <div className="flex items-center mb-3">
              <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
              <h4 className="text-sm font-medium">Premium Themes</h4>
              <Badge className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Pro
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {proThemes.map((theme) => (
                <ThemePreview key={theme.id} theme={theme} />
              ))}
            </div>
          </div>
        </ProFeatureGate>
      )}
    </div>
  );
}