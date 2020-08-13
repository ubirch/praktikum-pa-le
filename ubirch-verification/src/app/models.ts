export interface IUbirchResponse {
  anchors: IUbirchAnchor[];
  prev: any;
  upp: string;
}

export interface IUbirchAnchor {
  label: string;
  properties: any;
}

export interface IResponseInfo {
  type: string;
  header: string;
  info: string;
}

export interface IUbirchAnchorProperties {
  blockchain: string;
  created: string;
  hash: string;
  message: string;
  network_info: string;
  network_type: string;
  prev_hash: string;
  public_chaing: string;
  status: string;
  timestamp: string;
  txid: string;
}

export interface IUbirchBlockchainNet {
  url: string;
  icon_url: string;
}

