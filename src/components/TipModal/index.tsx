import { FC } from 'react';
import { Popup } from '@taroify/core';

export interface ITipModalProps {
  open: boolean;
  placement?: 'bottom' | 'top';
  onClose?: () => void;
}

const TipModal: FC<ITipModalProps> = ({
  children,
  placement = 'bottom',
  ...props
}) => {
  return (
    <Popup rounded placement={placement} {...props}>
      <Popup.Close />
      {children}
    </Popup>
  );
};

export default TipModal;
