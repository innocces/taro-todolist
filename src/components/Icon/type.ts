import { ITouchEvent } from '@tarojs/components';
import { CSSProperties } from 'react';

export interface IProps {
  className?: string;
  style?: CSSProperties;
  onClick?: (event: ITouchEvent) => void;
}
