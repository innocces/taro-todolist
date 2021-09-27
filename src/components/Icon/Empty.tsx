import { FC } from 'react';
import { Text } from '@tarojs/components';
import classnames from 'classnames';

import '@/style/font.less';
import { IProps } from './type';

const EmptyIcon: FC<IProps & { single?: boolean }> = ({
  className,
  single,
  ...props
}) => {
  return (
    <Text
      className={classnames(
        'iconfont',
        `icon-empty${single ? '-single' : ''}`,
        className,
      )}
      {...props}
    />
  );
};

export default EmptyIcon;
