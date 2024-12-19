export interface Options {
  classes: Array<string>;
  rules: Array<Rules>;
  allowEmail?: boolean;
}
export interface Rules {
  marker: string;
  type: string;
  toUrl: (arg: string) => string;
  classes: Array<string>;
}
export declare const defaultOptions: Options;
