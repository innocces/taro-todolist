export interface ITodoListItem {
  id: number;
  description: string;
  time: string;
  status: boolean;
  type: 'tag' | 'todo';
}

export interface ITagListItem {
  id: number;
  description: string;
  time: string;
  title: string;
  type: 'tag' | 'todo';
}

export interface IPrevDataSource {
  tags: ITagListItem[];
  list: ITodoListItem[];
}
