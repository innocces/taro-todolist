import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, Ad } from '@tarojs/components';
import { ENV_TYPE, pxTransform, useShareAppMessage } from '@tarojs/taro';
import {
  Button,
  NoticeBar,
  Sticky,
  Image,
  Row,
  Col,
  Empty,
  Checkbox,
  Cell,
  Collapse,
} from '@taroify/core';
import TipModal from '@/components/TipModal';
import { IconEmpty } from '@components/Icon';
import UpdateTip from '@/components/UpdateTip';

import { LOCALKEY, USERINFO } from '@/constant';
import { isEmpty } from '@/utils';

import { useStorage, useUserInfo, useEnv } from 'taro-hooks';
import classnames from 'classnames';
import type { IUserInfo } from 'taro-hooks/es/useUserInfo';
import type { ITodoListItem, IPrevDataSource, ITagListItem } from './type';

import './index.less';

const TodoList = () => {
  const [adModalVisible, changeAdModalVisible] = useState<boolean>(false);
  const stickyContainer = useRef<Element>();
  const [activeKey, setActiveKey] = useState<number>(0);
  const [todoList, setTodoList] = useState<(ITodoListItem | ITagListItem)[]>(
    [],
  );
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [userProfile, { getUserProfile }] = useUserInfo();
  const [{ storage }, { set }] = useStorage();
  const env = useEnv();

  useEffect(() => {
    if (!isEmpty(storage)) {
      setTodoList(
        storage[LOCALKEY]
          ? typeof storage[LOCALKEY] === 'string'
            ? JSON.parse(storage[LOCALKEY])
            : []
          : [],
      );
      setUserInfo(storage[USERINFO]);
    }
  }, [storage]);

  useEffect(() => {
    if (userProfile?.nickName) {
      set(USERINFO, userProfile);
    }
  }, [userProfile, set]);

  const handleGetUserInfo = useCallback(() => {
    getUserProfile({
      desc: '小程序将您的信息展示在首页',
    });
  }, [getUserProfile]);

  const waitList = useMemo((): ITodoListItem[] => {
    // 兼容一下以前的格式
    if (Array.isArray(todoList)) {
      return (
        (todoList as ITodoListItem[]).filter((item) => item.type === 'todo') ||
        []
      );
    } else {
      return (todoList as IPrevDataSource).list || [];
    }
  }, [todoList]);

  const tagList = useMemo((): ITagListItem[] => {
    if (Array.isArray(todoList)) {
      return (
        (todoList as ITagListItem[]).filter((item) => item.type === 'tag') || []
      );
    } else {
      return (todoList as IPrevDataSource).tags || [];
    }
  }, [todoList]);

  useShareAppMessage(() => {
    return {
      title: '快来记录你的第一个待办📅',
      path: '/pages/index/index',
      imageUrl: require('@/image/todolist-select.png'),
    };
  });

  console.log(storage, activeKey);
  return (
    <View className="todolist" ref={stickyContainer}>
      <Sticky container={stickyContainer}>
        <NoticeBar scrollable>
          <NoticeBar.Icon>
            <Text className="iconfont icon-notice" />
          </NoticeBar.Icon>
          本工具的所有数据均存储与本地, 故请勿轻易移除小程序, 否则数据将会丢失!
        </NoticeBar>
        {ENV_TYPE.WEAPP === env && (
          <Row className="todolist-userinfo" gutter={12} align="center">
            <Col>
              <Image
                style={{
                  width: pxTransform(100),
                  height: pxTransform(100),
                }}
                round
                lazyLoad
                fallback
                src={userInfo?.avatarUrl}
              />
            </Col>
            <Col>
              {userInfo?.nickName ? (
                <Text className="taroify-ellipsis">{userInfo?.nickName}</Text>
              ) : (
                <Button onClick={handleGetUserInfo}>获取个人信息</Button>
              )}
            </Col>
          </Row>
        )}
        <Row
          align="center"
          className={classnames('todolist-tabs', { active: activeKey })}
        >
          <Col span={12} className="todolist-block">
            <Text
              onClick={() => setActiveKey(0)}
              className="todolist-tabs-content"
            >
              待办
            </Text>
          </Col>
          <Col span={12} className="todolist-block">
            <Text
              onClick={() => setActiveKey(1)}
              className="todolist-tabs-content"
            >
              备忘
            </Text>
          </Col>
        </Row>
      </Sticky>
      <View className="todolist-tabs-panel">
        <View
          className={classnames('todolist-tabs-panel-wrap', {
            active: activeKey,
          })}
        >
          <View className="todolist-tabs-panel-item">
            {waitList.length ? (
              waitList.map(({ description, status, id }) => (
                <Cell clickable key={id} title={description}>
                  <Checkbox checked={status} onChange={console.log} />
                </Cell>
              ))
            ) : (
              <Empty>
                <IconEmpty single className="todolist-empty" />
                <Empty.Description>暂无待办内容</Empty.Description>
                <Button color="danger" className="todolist-gap">
                  添加你的第一个待办!
                </Button>
              </Empty>
            )}
          </View>
          <View className="todolist-tabs-panel-item">
            {tagList.length ? (
              <Collapse>
                {tagList.map(({ title, description, id }) => (
                  <Collapse.Item title={title} key={id}>
                    {description}
                  </Collapse.Item>
                ))}
              </Collapse>
            ) : (
              <Empty>
                <IconEmpty className="todolist-empty-normal" />
                <Empty.Description>暂无备忘内容</Empty.Description>
                <Button color="danger" className="todolist-gap">
                  添加你的第一个备忘!
                </Button>
              </Empty>
            )}
          </View>
        </View>
      </View>
      {!adModalVisible && env !== ENV_TYPE.WEB && (
        <Button
          className="flot-button"
          shape="circle"
          size="small"
          color="warning"
          onClick={() => changeAdModalVisible(true)}
        >
          观看广告
        </Button>
      )}
      <TipModal
        open={adModalVisible}
        onClose={() => changeAdModalVisible(false)}
      >
        <Ad unitId="adunit-7809e450e620082f" adIntervals={30} />
      </TipModal>
      <UpdateTip />
    </View>
  );
};
export default TodoList;
