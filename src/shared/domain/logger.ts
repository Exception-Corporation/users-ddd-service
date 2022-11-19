export interface Logger {
  info: (message: string) => void;
  error: (message: logError) => void;
  warn: (message: string) => void;
  debug: (message: string) => void;
  success: (message: logSuccess) => void;
  table: (message: Array<any>) => void;
}

export type EntityInfo = {
  [key: string]: any;
};

export type ExceptionParams = {
  module: string;
  type: string;
  message: string | null;
  error: any;
  params: object;
  dictionary: Array<ExceptionDictionary>;
  entityinfo: EntityInfo | Array<EntityInfo> | null;
};

export type logError = {
  entityinfo?: EntityInfo | Array<EntityInfo> | null;
  level: Levels;
  message: string;
  module: string;
  stack?: string | null | undefined;
  type: string;
  params?: object;
};

export type logSuccess = {
  entityinfo?: EntityInfo | Array<EntityInfo> | null;
  level: Levels | 'ok';
  module: string;
  result: any;
};

export type Levels = 'debug' | 'info' | 'warn' | 'error';

export enum fileLevels {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn'
}

export type ExceptionDictionary = {
  type: string;
  message: string;
};
export interface Console {
  assert(condition?: boolean, ...data: any[]): void;
  clear(): void;
  count(label?: string): void;
  countReset(label?: string): void;
  debug(...data: any[]): void;
  dir(item?: any, options?: any): void;
  dirxml(...data: any[]): void;
  error(...data: any[]): void;
  group(...data: any[]): void;
  groupCollapsed(...data: any[]): void;
  groupEnd(): void;
  info(...data: any[]): void;
  log(...data: any[]): void;
  table(tabularData?: any, properties?: string[]): void;
  time(label?: string): void;
  timeEnd(label?: string): void;
  timeLog(label?: string, ...data: any[]): void;
  timeStamp(label?: string): void;
  trace(...data: any[]): void;
  warn(...data: any[]): void;
}
