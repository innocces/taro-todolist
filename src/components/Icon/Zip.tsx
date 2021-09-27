import { FC } from 'react';
import { Text } from '@tarojs/components';
import classnames from 'classnames';

import '@/style/font.less';
import { IProps } from './type';

const ZipIcon: FC<IProps> = ({ className, ...props }) => {
  return (
    <Text
      className={classnames('iconfont', 'icon-zip', className)}
      {...props}
    />
  );
};

export default ZipIcon;
