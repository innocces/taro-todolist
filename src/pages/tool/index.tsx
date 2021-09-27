import { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Row, Col } from '@taroify/core';

import { useStorage } from 'taro-hooks';

import zipImg from '@/image/zip.png';
import './index.less';

const TOOLSLIST = [
  {
    icon: zipImg,
    name: '压缩图片',
    key: 'zip',
  },
];

const ToolsBox = () => {
  const [storageInfo] = useStorage();
  console.log(storageInfo);
  return (
    <View className="tools">
      {TOOLSLIST.map(({ icon, name, key }) => (
        <Row className="tools-item" key={key}>
          <Col span={5}>
            <Image className="tools-item-icon" src={icon} />
          </Col>
          <Col>
            <Text>{name}</Text>
          </Col>
        </Row>
      ))}
    </View>
  );
};
export default ToolsBox;
