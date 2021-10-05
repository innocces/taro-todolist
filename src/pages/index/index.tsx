import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, Ad, ITouchEvent } from '@tarojs/components';
import { ENV_TYPE, pxTransform, useShareAppMessage } from '@tarojs/taro';
import {
  NoticeBar,
  Sticky,
  Image,
  Row,
  Col,
  Empty,
  Cell,
  Collapse,
  SwipeCell,
  Switch,
} from '@taroify/core';
import Button from '@/components/Button';
import TipModal from '@/components/TipModal';
import { IconEmpty } from '@components/Icon';
import UpdateTip from '@/components/UpdateTip';
import EditeModal from '@/components/EditeModal';

import { LOCALKEY, USERINFO, MODALCONFIG } from '@/constant';
import { isEmpty, getDate, uuid } from '@/utils';

import {
  useStorage,
  useUserInfo,
  useEnv,
  useModal,
  useToast,
} from 'taro-hooks';
import classnames from 'classnames';
import type { IUserInfo } from 'taro-hooks/es/useUserInfo';
import type {
  ITodoListItem,
  IPrevDataSource,
  ITagListItem,
  TInfo,
} from './type';

import './index.less';

const TodoList = () => {
  const [adModalVisible, changeAdModalVisible] = useState<boolean>(false);
  const stickyContainer = useRef<Element>();
  const [activeKey, setActiveKey] = useState<number>(0);
  const [tagActiveId, setTagActiveId] = useState<string>();
  const [todoList, setTodoList] = useState<TInfo[]>([]);
  const [chooseItem, setChooseItem] = useState<TInfo>();
  const [editeVisible, setEditVisible] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [userProfile, { getUserProfile }] = useUserInfo();
  const [{ storage }, { set }] = useStorage();
  const [showModal] = useModal({ ...MODALCONFIG, title: '操作提示' });
  const [showToast] = useToast({ mask: true, icon: 'none' });
  const env = useEnv();

  const generateTodoList = useCallback(
    (localList: ITodoListItem[] | IPrevDataSource) => {
      if (Array.isArray(localList)) {
        setTodoList(localList);
      } else {
        // if prev, format and set
        const { tags, list } = localList as IPrevDataSource;
        const formatTodoList = [
          ...tags.map((v, i) => ({
            ...v,
            type: 'tag',
            id: v.id || uuid(i),
          })),
          ...list.map((v, i) => ({
            ...v,
            type: 'info',
            id: v.id || uuid(i),
          })),
        ];
        set(LOCALKEY, formatTodoList);
      }
    },
    [set],
  );

  useEffect(() => {
    if (!isEmpty(storage)) {
      generateTodoList(
        storage[LOCALKEY]
          ? typeof storage[LOCALKEY] === 'string'
            ? JSON.parse(storage[LOCALKEY])
            : storage[LOCALKEY]
          : [],
      );
      setUserInfo(storage[USERINFO]);
    }
  }, [storage, generateTodoList]);

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

  const handleEdit = useCallback(
    ($event: ITouchEvent, chooseInfo?: TInfo) => {
      $event.preventDefault();
      setEditVisible(true);
      if (!chooseInfo) {
        chooseInfo = {
          id: uuid(1),
          description: '',
          time: getDate(),
          status: false,
          type: activeKey === 0 ? 'info' : 'tag',
        };
      }
      setChooseItem(chooseInfo);
    },
    [activeKey],
  );

  const handleSave = useCallback(
    (info: TInfo) => {
      const exit = todoList.find((v) => v.id === info.id);
      set(
        LOCALKEY,
        exit
          ? todoList.map((v) => {
              if (v.id === info.id) {
                v = { ...info, time: getDate() };
              }
              return v;
            })
          : [...todoList, info],
      );
      setEditVisible(false);
      showToast({ title: '保存成功!' });
    },
    [todoList, set, showToast],
  );

  const handleDelete = useCallback(
    (id: number) => {
      showModal({ content: '确认删除此条待办信息?' }).then((res) => {
        let content = '删除成功!';
        if ((res as any).confirm) {
          const filterTodoList = todoList.filter((v) => v.id !== id) || [];
          set(LOCALKEY, filterTodoList);
        } else {
          content = '取消删除';
        }
        showToast({ title: content });
      });
    },
    [todoList, set, showModal, showToast],
  );

  const handleStatus = useCallback(
    (id: number) => {
      showModal({ content: '确认是否完成此条事项?' }).then((res) => {
        let content = '恭喜您完成事项, 坚持完成剩下的事项吧!';
        if ((res as any).confirm) {
          set(
            LOCALKEY,
            todoList.map((v) => ({
              ...v,
              status: v.id === id ? true : (v as ITodoListItem).status,
              time: getDate(),
            })),
          );
        } else {
          content = '取消操作';
        }
        showToast({ title: content });
      });
    },
    [todoList, set, showModal, showToast],
  );

  const waitList = useMemo((): ITodoListItem[] => {
    return (
      (todoList as ITodoListItem[]).filter((item) => item.type === 'info') || []
    );
  }, [todoList]);

  const tagList = useMemo((): ITagListItem[] => {
    return (
      (todoList as ITagListItem[]).filter((item) => item.type === 'tag') || []
    );
  }, [todoList]);

  useShareAppMessage(() => {
    return {
      title: '快来记录你的第一个待办📅',
      path: '/pages/index/index',
      imageUrl: require('@/image/todolist-select.png'),
    };
  });

  console.log(todoList);

  console.log(storage, activeKey, getDate());
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
              waitList.map(({ description, status, id }, index) => (
                <SwipeCell key={id}>
                  <Cell
                    clickable
                    className={classnames({
                      ['todolist-tabs-panel-item-disable']: status,
                    })}
                    title={description}
                    onClick={($event) =>
                      !status && handleEdit($event, waitList[index])
                    }
                  >
                    {status && <Switch checked disabled size={14} />}
                  </Cell>
                  <SwipeCell.Actions side="right">
                    <Button
                      variant="contained"
                      shape="square"
                      color="info"
                      disabled={status}
                      onClick={() => handleStatus(id)}
                    >
                      完成
                    </Button>
                    <Button
                      variant="contained"
                      shape="square"
                      color="danger"
                      onClick={() => handleDelete(id)}
                    >
                      删除
                    </Button>
                  </SwipeCell.Actions>
                </SwipeCell>
              ))
            ) : (
              <Empty>
                <IconEmpty single className="todolist-empty" />
                <Empty.Description>暂无待办内容</Empty.Description>
                <Button
                  color="danger"
                  className="todolist-gap"
                  onClick={($event) => handleEdit($event)}
                >
                  添加你的第一个待办!
                </Button>
              </Empty>
            )}
          </View>
          <View className="todolist-tabs-panel-item">
            {tagList.length ? (
              <Collapse
                accordion
                activeKey={tagActiveId}
                onChange={(accordionId: string) => {
                  console.log(accordionId);
                  setTagActiveId(accordionId);
                }}
              >
                {tagList.map(({ description, id, title }, index) => (
                  <Collapse.Item title={title || description} key={String(id)}>
                    <SwipeCell key={id}>
                      <Text className="todolist-tabs-panel-item-inner">
                        {description}
                      </Text>
                      <SwipeCell.Actions side="right">
                        <Button
                          variant="contained"
                          shape="square"
                          color="info"
                          onClick={($event) =>
                            handleEdit($event, tagList[index])
                          }
                        >
                          编辑
                        </Button>
                        <Button
                          variant="contained"
                          shape="square"
                          color="danger"
                          onClick={() => handleDelete(id)}
                        >
                          删除
                        </Button>
                      </SwipeCell.Actions>
                    </SwipeCell>
                  </Collapse.Item>
                ))}
              </Collapse>
            ) : (
              <Empty>
                <IconEmpty className="todolist-empty-normal" />
                <Empty.Description>暂无备忘内容</Empty.Description>
                <Button
                  color="danger"
                  className="todolist-gap"
                  onClick={($event) => handleEdit($event)}
                >
                  添加你的第一个备忘!
                </Button>
              </Empty>
            )}
          </View>
        </View>
      </View>
      <Button
        shape="circle"
        size="small"
        color="danger"
        className={classnames('flot-button', 'todolist-flot', {
          'todolist-flot-active':
            (activeKey === 0 && waitList.length) ||
            (activeKey === 1 && tagList.length),
        })}
        onClick={($event) => handleEdit($event)}
      >
        新建{activeKey === 0 ? '待办' : '备忘'}
      </Button>
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
      <EditeModal
        open={editeVisible}
        info={chooseItem}
        onClose={() => setEditVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
};
export default TodoList;
