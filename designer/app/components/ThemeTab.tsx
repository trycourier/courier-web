'use client';

import { themePresets, themePresetLabels, type ThemePreset } from './theme-presets';

interface ThemeTabProps {
  selectedTheme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
}

// Helper function to get theme color and styling
function getThemeStyles(themeKey: ThemePreset) {
  const styles: Record<ThemePreset, { accentColor: string; borderColor: string; borderRadius: string; fontFamily: string }> = {
    default: {
      accentColor: '#6B7280',
      borderColor: '#D1D5DB',
      borderRadius: '8px',
      fontFamily: 'system-ui',
    },
    poppins: {
      accentColor: '#8B5CF6',
      borderColor: '#8B5CF6',
      borderRadius: '8px',
      fontFamily: 'Poppins',
    },
    inter: {
      accentColor: '#10B981',
      borderColor: '#10B981',
      borderRadius: '12px',
      fontFamily: 'Inter',
    },
    roboto: {
      accentColor: '#EF4444',
      borderColor: '#EF4444',
      borderRadius: '16px',
      fontFamily: 'Roboto',
    },
    'open-sans': {
      accentColor: '#3B82F6',
      borderColor: '#3B82F6',
      borderRadius: '10px',
      fontFamily: 'Open Sans',
    },
  };
  return styles[themeKey];
}

export function ThemeTab({ selectedTheme, onThemeChange }: ThemeTabProps) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Theme Presets
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Select a theme preset to customize the inbox and popup appearance.
        </p>
        <div className="space-y-3">
          {(Object.keys(themePresets) as ThemePreset[]).map((themeKey) => {
            const themeStyles = getThemeStyles(themeKey);
            const isSelected = selectedTheme === themeKey;

            return (
              <label
                key={themeKey}
                className={`flex items-center p-4 cursor-pointer transition-all ${isSelected
                    ? 'border-2 shadow-md'
                    : 'border border-gray-300 dark:border-gray-700'
                  } hover:shadow-sm`}
                style={{
                  borderRadius: themeStyles.borderRadius,
                  borderColor: isSelected ? themeStyles.borderColor : undefined,
                  backgroundColor: isSelected ? `${themeStyles.accentColor}08` : undefined,
                }}
              >
                <input
                  type="radio"
                  name="theme-preset"
                  value={themeKey}
                  checked={isSelected}
                  onChange={() => onThemeChange(themeKey)}
                  className="mr-4 h-4 w-4 focus:ring-2 focus:ring-offset-2"
                  style={{
                    accentColor: themeStyles.accentColor,
                    '--tw-ring-color': themeStyles.accentColor,
                  } as React.CSSProperties & { '--tw-ring-color': string }}
                />
                <div className="flex-1 flex items-center gap-3">
                  {/* Color indicator */}
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm"
                    style={{
                      backgroundColor: themeStyles.accentColor,
                    }}
                  />
                  <div className="flex-1">
                    <div
                      className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1"
                      style={{
                        fontFamily: themeStyles.fontFamily,
                      }}
                    >
                      {themePresetLabels[themeKey]}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>Accent: </span>
                      <span
                        className="font-mono px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${themeStyles.accentColor}15`,
                          color: themeStyles.accentColor,
                        }}
                      >
                        {themeStyles.accentColor}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: themeStyles.accentColor,
                      }}
                    />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

