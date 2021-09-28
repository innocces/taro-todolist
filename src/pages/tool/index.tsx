import { useState, useEffect } from 'react';
import { View, Image } from '@tarojs/components';
import { Button } from '@taroify/core';
import { ENV_TYPE, useShareAppMessage } from '@tarojs/taro';
import TipModal from '@/components/TipModal';

import { useRouter, useEnv } from 'taro-hooks';

import zipImg from '@/image/zip.png';
import './index.less';

const TOOLSLIST = [
  {
    icon: zipImg,
    name: '压缩图片',
    key: 'compress',
  },
];

const ToolsBox = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [_, { navigateTo }] = useRouter();
  const env = useEnv();

  useEffect(() => {
    setTimeout(() => {
      setModalVisible(true);
    }, 500);
  }, []);

  useShareAppMessage(() => {
    return {
      title: '一个百宝箱🌟',
      path: '/pages/tool/index',
      imageUrl: require('@/image/tools-select.png'),
    };
  });

  return (
    <View className="tools">
      {TOOLSLIST.map(({ icon, name, key }) => (
        <Button
          block
          hairline
          key={key}
          className="tools-item"
          variant="outlined"
          icon={<Image className="tools-item-icon" src={icon} />}
          onClick={() => navigateTo(`/pages/${key}/index`)}
        >
          {name}
        </Button>
      ))}
      <TipModal
        placement="top"
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View className="tip">
          一个会不断更新的工具小集合, 如果你有什么小建议,
          不如右上角点击更多建议反馈一波! 说不定你想要的功能就被开发者实现了呢😸
          {env === ENV_TYPE.WEB && (
            <a href="https://general-tools.vercel.app/" target="_blank">
              您依然可以使用PC版工具库
            </a>
          )}
        </View>
      </TipModal>
    </View>
  );
};
export default ToolsBox;
