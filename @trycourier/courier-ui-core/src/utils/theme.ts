export interface Colors {
  primary: string;
  secondary: string;
  border: string;
  link: string;
}

export interface Theme {
  colors: Colors
  button: {
    cornerRadius: string;
  }
}

export const theme: { light: Theme, dark: Theme } = {
  light: {
    colors: {
      primary: '#0A0A0A',
      secondary: '#FFFFFF',
      border: '#E5E5E5',
      link: '#1D4ED8'
    },
    button: {
      cornerRadius: '4px'
    }
  },
  dark: {
    colors: {
      primary: '#FFFFFF',
      secondary: '#0A0A0A',
      border: '#3A3A3A',
      link: '#60A5FA'
    },
    button: {
      cornerRadius: '4px'
    }
  }
};