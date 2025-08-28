import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Palette } from 'lucide-react';
import { useColorTheme, ColorPalette } from '@/contexts/ColorThemeContext';

export const ColorThemePicker = () => {
  const { currentPalette, changePalette, availablePalettes } = useColorTheme();

  const ColorPreview = ({ palette }: { palette: ColorPalette }) => (
    <div className="flex gap-2 mb-2">
      <div 
        className="w-4 h-4 rounded-full border" 
        style={{ backgroundColor: `hsl(${palette.colors.primary})` }}
      />
      <div 
        className="w-4 h-4 rounded-full border"
        style={{ backgroundColor: `hsl(${palette.colors.primaryGlow})` }}
      />
      <div 
        className="w-4 h-4 rounded-full border"
        style={{ backgroundColor: `hsl(${palette.colors.accent})` }}
      />
    </div>
  );

  return (
    <Card className="bg-engine-surface border-border/20 shadow-engine-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg text-engine-text-primary">Color Theme</CardTitle>
        </div>
        <CardDescription className="text-engine-text-secondary">
          Choose from 4 beautiful color palettes to customize your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {availablePalettes.map((palette) => (
          <Button
            key={palette.id}
            variant={currentPalette.id === palette.id ? "default" : "outline"}
            className="w-full h-auto p-4 flex items-start justify-between"
            onClick={() => changePalette(palette)}
          >
            <div className="flex flex-col items-start text-left">
              <div className="font-medium text-sm">{palette.name}</div>
              <ColorPreview palette={palette} />
            </div>
            {currentPalette.id === palette.id && (
              <Check className="h-4 w-4 mt-1" />
            )}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};