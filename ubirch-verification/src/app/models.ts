export interface IUbirchResponse {
  anchors: IUbirchAnchor[];
  prev: any;
  upp: string;
}

export interface IUbirchAnchor {
  label: string;
  properties: any;
}

export interface IresponseInfo {
  type: string;
  header: string;
  info: string;
}

export enum EError{

}

