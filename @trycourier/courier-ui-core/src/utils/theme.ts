import { CourierColors } from "./courier-colors";

export interface Colors {
  primary: string;
  secondary: string;
  border: string;
  link: string;
  icon: string;
  /**
   * The accent a message action is drawn in when nothing has themed it.
   *
   * One blue, the same in both modes. The rest of this palette is ink — it inverts between
   * light and dark, which is right for body text and wrong for an action: a template author
   * picking a style in the designer sees one colour, and the same action arriving in a dark
   * inbox would have shown its opposite. An accent that does not move is the same decision in
   * both places.
   */
  accent: string;
  /**
   * The accent drawn as a label or an outline rather than as a fill.
   *
   * `accent` sits under white text, so it has to stay dark enough to carry it. Drawn *on* the
   * surface it has the opposite job, and on a near-black one it needs lifting to stay legible —
   * the same lift, and the same value, a link already rests at.
   */
  accentText: string;
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
      icon: CourierColors.black[500],
      accent: CourierColors.blue[500],
      accentText: CourierColors.blue[500]
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
      icon: CourierColors.white[500],
      // The fill does not move between modes; only the accent-as-text is lifted.
      accent: CourierColors.blue[500],
      accentText: CourierColors.blue[400]
    },
    button: {
      cornerRadius: '4px'
    }
  }
};