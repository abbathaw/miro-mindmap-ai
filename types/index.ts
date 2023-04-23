export type LocationPoints = {
  x: number;
  y: number;
};

export type FrameData = {
  location: LocationPoints;
  width: number;
  height: number;
};

export interface ISubmitProps {
  text: string;
}
export interface ISideBarSubmitProps {
  onSubmit: (values: ISubmitProps) => void;
}
