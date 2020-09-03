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

export interface IUbirchblockchain {
  nodeIcon: string;
  explorerUrl: IUbirchBlockchainTransidCheckUrl;
}

export interface IUbirchBlockchainTransidCheckUrl {
  bdr?: IUbirchBlockchainNet;
  testnet?: IUbirchBlockchainNet;
  mainnet?: IUbirchBlockchainNet;
}

export interface IUbirchAnchorObject{
  href: any;
  target: string;
  title: string;
  icon: string;
}

export interface IUbirchSeal{
  src: string;
  href: string;
}

export interface IUbirchVerificationEnvConfig {
  verify_api_url: string;
  seal_icon_url: string;
  no_seal_icon_url: string;
  console_verify_url: string;
  asset_url_prefix: string;
}

export interface IUbirchVerificationFormData {
  
  
    b: number;
    d: number; 
    f: string,
    g: string,
    i: string,
    p: string,
    r: string,
    s: string,
    t: string
   
  
}
