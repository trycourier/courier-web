'use client';

import { themePresetLabels, type ThemePreset } from './theme-presets';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ThemeTabProps {
  selectedTheme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
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

export function ThemeTab({ selectedTheme, onThemeChange }: ThemeTabProps) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="space-y-6 flex-1">
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

      <div className="pt-4 mt-auto border-t border-border space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="mb-3">
            You can fully customize the Courier Inbox and Popup Menu components to match your app's design. 
            Customize fonts, colors, spacing, animations, and more through the theme system.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href="https://www.courier.com/docs/sdk-libraries/courier-react-web#styles-and-theming"
              target="_blank"
              rel="noopener noreferrer"
            >
              React SDK Docs
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href="https://www.courier.com/docs/sdk-libraries/courier-ui-inbox-web#styles-and-theming"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web Components Docs
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

