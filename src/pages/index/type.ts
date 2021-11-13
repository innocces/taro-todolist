export interface ITodoListItem {
  id: number;
  description: string;
  time: string;
  status: boolean;
  type: 'tag' | 'info';
}

export interface ITagListItem {
  id: number;
  description: string;
  time: string;
  title: string;
  type: 'tag' | 'info';
}

export interface IPrevDataSource {
  tags: ITagListItem[];
  list: ITodoListItem[];
}

export type TInfo = ITagListItem | ITodoListItem;

export interface IReferInfo {
  from: string;
}
