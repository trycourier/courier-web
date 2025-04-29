export const CourierColors = {
  black: {
    400: '#0A0A0A',
    500: '#171717',
    500_10: '#1717171A',
  },
  gray: {
    200: '#F5F5F5',
    400: '#3A3A3A',
    500: '#E5E5E5',
    600: '#737373',
  },
  white: {
    500: '#FFFFFF',
    500_10: '#FFFFFF1A',
  },
  blue: {
    400: '#60A5FA',
    500: '#2563EB',
  }
};

export interface Colors {
  primary: string;
  secondary: string;
  border: string;
  link: string;
  icon: string;
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
      primary: CourierColors.black[500],
      secondary: CourierColors.white[500],
      border: CourierColors.gray[500],
      link: CourierColors.blue[500],
      icon: CourierColors.black[500]
    },
    button: {
      cornerRadius: '4px'
    }
  },
  dark: {
    colors: {
      primary: CourierColors.white[500],
      secondary: CourierColors.black[500],
      border: CourierColors.gray[400],
      link: CourierColors.blue[400],
      icon: CourierColors.white[500]
    },
    button: {
      cornerRadius: '4px'
    }
  }
};