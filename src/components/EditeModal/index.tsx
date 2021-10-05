import { FC, useCallback, useEffect, useState } from 'react';
import Modal, { ITipModalProps } from '@/components/TipModal';
import { BaseEventOrig, View } from '@tarojs/components';
import { Field, Cell } from '@taroify/core';
import Button from '@components/Button';
import type { ITagListItem, ITodoListItem } from '@/pages/index/type';
import type { InputProps } from '@tarojs/components/types/Input';

import { getDate } from '@/utils';

import './index.less';

type TInfo = ITagListItem | ITodoListItem;

interface IEditeModalProps extends ITipModalProps {
  info?: TInfo;
  onSave: (info: TInfo) => void;
}

const EditeModal: FC<IEditeModalProps> = ({ info, onSave, ...props }) => {
  const [editorInfo, setEditorInfo] = useState<Partial<TInfo>>(info || {});

  useEffect(() => {
    info && setEditorInfo(info);
  }, [info]);

  const handleFieldChange = useCallback(
    (
      key: keyof ITagListItem,
      $e: BaseEventOrig<InputProps.inputEventDetail>,
    ) => {
      setEditorInfo({
        ...editorInfo,
        [key]: $e.detail.value,
      });
    },
    [editorInfo],
  );
  console.log(editorInfo);
  return (
    <Modal {...props} placement="bottom">
      <View className="tip">
        <Cell title="历史操作时间">{info?.time || getDate()}</Cell>
        {info && info.type === 'tag' ? (
          <Field
            label="标题"
            value={(editorInfo as ITagListItem).title || editorInfo.description}
            onChange={($e) => handleFieldChange('title', $e)}
          />
        ) : null}
        <Field
          label="内容"
          value={editorInfo.description}
          onChange={($e) => handleFieldChange('description', $e)}
        />
        <Button
          block
          color="danger"
          className="edite-button"
          onClick={() => onSave(editorInfo as TInfo)}
        >
          记录
        </Button>
      </View>
    </Modal>
  );
};

export default EditeModal;
