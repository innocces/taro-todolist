import { FC, useCallback } from 'react';
import { Button as TButton } from '@taroify/core';
import { useVibrate } from 'taro-hooks';
import type { ButtonProps } from '@taroify/core/button';
import type { ITouchEvent } from '@tarojs/components';

export interface IButtonProps extends ButtonProps {
  vibrate?: boolean;
}

const Button: FC<IButtonProps> = ({
  children,
  vibrate = true,
  onClick,
  ...props
}) => {
  const [vibrateAction] = useVibrate();
  const handleClick = useCallback(
    ($event: ITouchEvent) => {
      if (onClick) {
        vibrate && vibrateAction();
        onClick($event);
      }
    },
    [vibrate, onClick, vibrateAction],
  );
  return (
    <TButton {...props} onClick={handleClick}>
      {children}
    </TButton>
  );
};

export default Button;
