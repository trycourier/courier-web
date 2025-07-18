import { CourierColors } from "./courier-colors";

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