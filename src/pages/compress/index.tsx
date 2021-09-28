import { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Sticky, Row, Col, Empty, ActionSheet, NoticeBar } from '@taroify/core';
import { IconEmpty } from '@components/Icon';
import { useImage, useToast } from 'taro-hooks';
import compressIcon from '@/image/camera.png';

import './index.less';

interface ICompressFile {
  compress_url: string;
  origin_url: string;
  file?: File;
}

const Compress = () => {
  const [compressFiles, setCompressFiles] = useState<ICompressFile[]>([]);
  const [chooseIndex, setChooseIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const stickyContainer = useRef<Element>();
  const [showToast] = useToast({ mask: true, icon: 'none' });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { choose, preview, save, compress }] = useImage({
    count: 10,
  });

  const handleUpload = useCallback(async () => {
    try {
      const { tempFiles = [] } = await choose({});
      const uploadFiles: ICompressFile[] = [];
      for await (let { path } of tempFiles) {
        const { tempFilePath } = await compress(path);
        uploadFiles.push({
          origin_url: path,
          compress_url: tempFilePath,
        });
      }
      setCompressFiles([...compressFiles, ...uploadFiles]);
      showToast({
        title: `此次上传并压缩成功${uploadFiles.length}张`,
      });
    } catch (e) {
      showToast({
        title: '取消上传或上传失败',
      });
    }
  }, [compressFiles, choose, compress, showToast]);

  const chooseFile = useMemo(() => {
    return compressFiles[chooseIndex];
  }, [compressFiles, chooseIndex]);

  const handleImageAction = useCallback(
    async (name: string) => {
      const { compress_url, origin_url } = chooseFile;
      if (name === '预览图片') {
        preview({ urls: [origin_url, compress_url] });
      } else {
        try {
          await save(compress_url);
          showToast({ title: '保存成功' });
        } catch (e) {
          showToast({ title: '保存失败, 无权限或授权失败' });
        }
      }
      setVisible(false);
    },
    [chooseFile, preview, save, showToast],
  );

  return (
    <View ref={stickyContainer} className="compress">
      <Sticky container={stickyContainer}>
        <NoticeBar scrollable>
          若本身图片尺寸较小, 则无任何压缩效果, 图片直接调用微信API进行压缩,
          无服务端交互
        </NoticeBar>
        <View onClick={handleUpload}>
          <Row className="compress-header flex-direction-column" align="center">
            <Image
              mode="aspectFit"
              className="compress-header-icon"
              src={compressIcon}
            />
            <Text className="gap">点击上传</Text>
            <Text>仅可压缩图片, 切勿选择其他格式文件</Text>
          </Row>
        </View>
      </Sticky>
      {compressFiles.length ? (
        compressFiles.map(({ compress_url, origin_url }, i) => (
          <View
            key={i}
            onClick={() => {
              setChooseIndex(i);
              setVisible(true);
            }}
          >
            <Row
              justify="space-between"
              align="center"
              className="compress-item"
            >
              <Col span={12} className="compress-item-col">
                <Image
                  mode="aspectFit"
                  className="compress-item-img"
                  src={origin_url}
                />
              </Col>
              <Col span={12} className="compress-item-col">
                <Image
                  mode="aspectFit"
                  className="compress-item-img"
                  src={compress_url}
                />
              </Col>
            </Row>
          </View>
        ))
      ) : (
        <Empty>
          <IconEmpty className="empty" />
          <Empty.Description>暂未压缩任何图片</Empty.Description>
        </Empty>
      )}
      <ActionSheet
        open={visible}
        onSelect={({ name }) => handleImageAction(name as string)}
        onClose={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <ActionSheet.Header>请选择当前图片操作</ActionSheet.Header>
        <ActionSheet.Action name="预览图片" key={1} />
        <ActionSheet.Action name="下载图片(压缩后)" key={2} />
        <ActionSheet.Button type="cancel">取消</ActionSheet.Button>
      </ActionSheet>
    </View>
  );
};

export default Compress;
