export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | 'CONNECT'
  | 'TRACE';

export type Header = {
  key: string;
  value: string;
};

export type Body =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Body }
  | Body[];

export type CollectionRequest = {
  name: string;
  method: HttpMethod;
  url: URL;
  headers: Header[];
  body: Body;
}

export type CollectionFolder = {
  name: string;
  items: CollectionItem[];
}

export type CollectionItem = CollectionRequest | CollectionFolder;

export type Collection = {
  name: string;
  path: string | null;
  items: CollectionItem[];
}