import { useState, useEffect, useCallback } from 'react';
import TipModal from '@components/TipModal';
import { Image, Text } from '@tarojs/components';
import { ENV_TYPE } from '@tarojs/taro';
import { Row, Button } from '@taroify/core';
import { useStorage, useEnv } from 'taro-hooks';
import classnames from 'classnames';
import { UPDATETIP } from '@/constant';

import logo from '@/image/logo.png';

import './index.less';

export default () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [{ storage }, { set, get }] = useStorage();
  const env = useEnv();

  useEffect(() => {
    handleVisibleChange();
  }, [storage]);

  const handleVisibleChange = useCallback(async () => {
    try {
      const update = await get(UPDATETIP);
      if (typeof update === 'undefined') {
        setVisible(true);
      } else if (typeof storage[UPDATETIP] !== 'undefined') {
        setVisible(!storage[UPDATETIP]);
      }
    } catch (e) {
      setVisible(true);
    }
  }, [storage, get]);

  return (
    <>
      <TipModal
        placement="top"
        open={visible}
        onClose={() => set(UPDATETIP, 1)}
      >
        <Row
          className="flex-direction-column tip"
          align="center"
          justify="center"
        >
          <Image className="update-icon" src={logo} />
          <Text className="update-word">精巧待办小程序全新改版</Text>
          <Text className="update-word">新的UI, 新的功能</Text>
          <Text className="update-word">🎉🎉🎉🎉🎉🎉</Text>
        </Row>
      </TipModal>
      {!visible && (
        <Button
          shape="circle"
          size="small"
          color="info"
          className={classnames('flot-button', 'update-button', {
            'update-button-web': env === ENV_TYPE.WEB,
          })}
          onClick={() => setVisible(true)}
        >
          查看版本提示
        </Button>
      )}
    </>
  );
};
