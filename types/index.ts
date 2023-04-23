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
  onExpand: (values: ISubmitProps) => void;
  selectedTarget: any;
  isLoading: boolean;
}

export interface ApiRequestBody {
  input: string;
}
export interface ApiResponse {
  msg: string[];
}
