'use client';

import { themePresetLabels, type ThemePreset } from './theme-presets';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Sun as SunBase, Moon as MoonBase, Monitor as MonitorBase } from 'lucide-react';

// Cast to any to work around React 19 type incompatibility with lucide-react
const Sun = SunBase as React.ComponentType<any>;
const Moon = MoonBase as React.ComponentType<any>;
const Monitor = MonitorBase as React.ComponentType<any>;

export type ColorMode = 'light' | 'dark' | 'system';

interface ThemeTabProps {
  selectedTheme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

// Helper function to get theme color and font
function getThemeInfo(themeKey: ThemePreset): { color: string; fontFamily: string } {
  const themeInfo: Record<ThemePreset, { color: string; fontFamily: string }> = {
    default: {
      color: '#2563EB',
      fontFamily: 'system-ui',
    },
    poppins: {
      color: '#8B5CF6',
      fontFamily: 'Poppins',
    },
    inter: {
      color: '#10B981',
      fontFamily: 'Montserrat',
    },
    roboto: {
      color: '#EF4444',
      fontFamily: 'Playfair Display',
    },
    'open-sans': {
      color: '#F97316',
      fontFamily: 'Raleway',
    },
  };
  return themeInfo[themeKey];
}

export function ThemeTab({ selectedTheme, onThemeChange, colorMode, onColorModeChange }: ThemeTabProps) {
  const colorModeOptions: { value: ColorMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Color Mode Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">Appearance</Label>
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full">
            {colorModeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onColorModeChange(option.value)}
                className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                  colorMode === option.value
                    ? 'bg-background text-foreground shadow'
                    : 'hover:bg-background/50'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Presets */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">Style Preset</Label>
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={(value: string) => onThemeChange(value as ThemePreset)} 
            className="space-y-2 pb-5"
          >
            {(Object.keys(themePresetLabels) as ThemePreset[]).map((themeKey) => {
              const themeInfo = getThemeInfo(themeKey);
              const isSelected = selectedTheme === themeKey;
              
              return (
                <Label
                  key={themeKey}
                  htmlFor={themeKey}
                  className={`flex items-center w-full p-3 border rounded-md cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                >
                  <RadioGroupItem value={themeKey} id={themeKey} className="mr-3" />
                  <span
                    className="flex-1 font-semibold"
                    style={{ fontFamily: themeInfo.fontFamily }}
                  >
                    {themePresetLabels[themeKey]}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: themeInfo.color }}
                  />
                </Label>
              );
            })}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

