import { FC } from 'react';
import { Text } from '@tarojs/components';
import classnames from 'classnames';

import '@/style/font.less';
import { IProps } from './type';

const CloseIcon: FC<IProps> = ({ className, ...props }) => {
  return (
    <Text
      className={classnames('iconfont', 'icon-close', className)}
      {...props}
    />
  );
};

export default CloseIcon;
