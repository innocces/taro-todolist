import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
import { onShow, addItems, modifyItems } from '../../actions/todo'

import { AtDrawer, AtButton, AtNavBar, AtNoticebar, AtIcon, AtTabs, AtTabsPane, AtFloatLayout, AtTabBar, AtTextarea } from 'taro-ui';
import Header from '../../components/header';  // 导航
import NavMeau from '../../components/navMeau'; // 下方功能菜单
import Tags from '../../components/tags'; // tags列表
import Modal from '../../components/modal';  // Modal
import Loading from '../../components/loading'; // loading
import Todo from '../../components/item';  // 待办事项

import { formateTime } from '../../utils'

import './index.scss'


@connect(({ counter, todo }) => ({
  counter, todo
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  },
  onHide(payload) {
    dispatch(onShow(payload))
  },
  addItems(payload) {
    dispatch(addItems(payload))
  },
  modifyItems(payload){
    dispatch(modifyItems(payload))
  }
}))
class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      currTagItems: {},
      value: '',
      num: '20',
      flag: true
    }
  }

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.state)
    console.log(this.props, nextProps)
    let { todo: { tabcurrent, currTags, modify, datasource } } = nextProps;
    if(modify && !this.props.todo.modify){
      // 此时切换成修改模式，对state进行赋值操作
      var tags = datasource.tags[currTags];
      this.setState({
        currTagItems : tags,
        value : tags.title
      });
      console.log(this.state)
    }
  }

  componentWillUnmount() { }

  componentDidShow() {
    console.log(this.props)
    this.props.onHide({ showLoading: true })
    setTimeout(() => { this.props.onHide({ showLoading: false }) }, 300)
  }

  componentDidHide() { }

  onTab(index) {
    this.props.onHide({ current: index })
  }

  onItem(index) {
    if (!index) { return }
    this.props.onHide({ current: index - 1 })
  }

  tabchange(index) {
    let { value, currTagItems, num } = this.state, { todo: { tabcurrent, currTags, modify, datasource } } = this.props;
    // if (modify) {
    //   for(let i in datasource.tags[currTags]){
    //     if(!currTagItems[i]){
    //       currTagItems[i] = datasource.tags[currTags][i];
    //     }
    //   }
    // }
    console.log(this.state)
    if (tabcurrent !== index) {
      // 此时为切换tab,储存当前信息，清空value,并跳转tab
      if (index === 0) {
        // 储存description
        currTagItems.description = value;
        value = currTagItems.title ? currTagItems.title : ''
        num = '20';
      } else if (index === 1) {
        currTagItems.title = value;
        currTagItems.summary = value.slice(0, 15) + '...';
        value = currTagItems.description ? currTagItems.description : '';
        num = '40'
      }
      this.setState({
        value,
        currTagItems,
        num
      }, () => {
        this.props.onHide({
          tabcurrent: index
        })
      })
    }
  }

  onValueChange(event) {
    // 定义开关，避免多次达到峰值自动保存，其实是个小bug_(:з」∠)_
    let { todo: { tabcurrent, modify } } = this.props, currTagItems = this.state.currTagItems, flag = this.state.flag;
    if (!flag) return;
    let value = event.currentTarget.value
    // 标题20字跳转
    if (value.length !== 20 && tabcurrent === 0) {
      this.setState({
        value
      })
    } else if (value.length === 20 && tabcurrent === 0) {
      currTagItems.title = value;
      currTagItems.summary = value.slice(0, 15) + '...';
      this.setState({
        currTagItems,
        value: '',
        num: '40'
      });
      this.props.onHide({ tabcurrent: 1 })
    } else if (tabcurrent === 1 && value.length !== 40) {
      // 这里有个小bug，保留
      currTagItems.description = value;
      this.setState({
        currTagItems,
        value
      })
    } else if (tabcurrent === 1 && value.length === 40) {
      this.setState({
        flag: false
      })
      currTagItems.description = value;
      currTagItems.left = 20;
      currTagItems.time = formateTime();
      // 自动保存
      this.props.addItems({ kind: 'tags', items: this.state.currTagItems });
      // 显示loading
      this.props.onHide({ showLoading: true })
      // 保存后关闭浮层
      setTimeout(() => {
        this.setState({
          currTagItems: {},
          num: '20',
          value: '',
          flag: true
        })
        this.props.onHide({ showFloat: false, showLoading: false, tabcurrent: 0 });
      }, 1000)
    }
  }

  onBtnClick() {
    let { todo: { currTags, modify, edit } } = this.props;
    let { currTagItems } = this.state;
    currTagItems.left = 20;
    currTagItems.time = formateTime();
    if(modify){
      // 修改
      this.props.modifyItems({ kind: 'tags', items : currTagItems, index : currTags });
    }else if(edit){
      // 添加
      this.props.addItems({ kind: 'tags', items: currTagItems });
    }
    // 显示loading
    this.props.onHide({ showLoading: true })
    // 保存后关闭浮层
    setTimeout(() => {
      this.setState({
        currTagItems: {},
        num: '20',
        value: '',
        flag: true
      })
      this.props.onHide({ showFloat: false, showLoading: false, tabcurrent: 0, currTags : 0 });
    }, 1000);
    console.log(this.state)
  }

  // 关闭浮层
  onFloatClose(){
    this.props.onHide({ showFloat: false, edit: false, modify: false, tabcurrent : 0 });
    this.setState({
      currTagItems: {},
      num: '20',
      value: '',
      flag: true
    })
  }

  onShareAppMessage(){
    return {
      title: '精巧的待办事项~',
      path : '/pages/index/index',
      imageUrl : require('../../img/todo_list.png')
    }
  }

  render() {
    let { todo: { show, showFloat, currTags, edit, showLoading, datasource, modify } } = this.props;
    let tabs = [
      { title: '待办事项' },
      { title: 'Tags' }
    ];
    return (
      <View className='index'>
        {
          showLoading ?
            <Loading />
            :
            null
        }
        <Header />
        <AtNoticebar icon="sketch" marquee>欢迎使用小巧的待办事项~</AtNoticebar>
        <AtDrawer
          show={show}
          onClose={this.props.onHide.bind(this, { show: false })}
          mask
          onItemClick={this.onItem.bind(this)}
          items={['', '全部待办事项', '全部Tags']}
        ></AtDrawer>
        <AtTabs
          current={this.props.todo.current}
          tabList={tabs}
          swipeable={false}
          onClick={this.onTab.bind(this)}>
          <AtTabsPane index={0} current={this.props.todo.current}>
            <Todo/>
          </AtTabsPane>
          <AtTabsPane index={1} current={this.props.todo.current}>
            <Tags />
          </AtTabsPane>
        </AtTabs>
        {/* <View onClick={this.props.onHide.bind(this, { showModal: true })}>ok</View> */}
        <AtFloatLayout
          isOpened={showFloat}
          title={ edit ? this.state.currTagItems.summary ? this.state.currTagItems.summary : '待添加标题' : currTags || currTags === 0 ? datasource.tags[currTags].summary  : '待添加标题'}
          onClose={this.onFloatClose.bind(this)} >
          <View className='toolsbar'>
            {
              edit || modify ?
                <AtTabBar
                  tabList={[
                    { title: '标题' },
                    { title: '内容' }
                  ]}
                  onClick={this.tabchange.bind(this)}
                  current={this.props.todo.tabcurrent}
                />
                :
                null
            }
          </View>
          <View className='at-article'>
            <View className='at-article__info'>
              {edit ? formateTime() : currTags || currTags === 0 ? datasource.tags[currTags].time : ''}
            </View>
            <View className='at-article__content'>
              <View className='at-article__section'>
                <View className='at-article__p'>
                  {
                    edit || modify ?
                      <AtTextarea
                        value={this.state.value}
                        onChange={this.onValueChange.bind(this)}
                        maxlength={this.state.num}
                        placeholder={ this.props.todo.tabcurrent === 1 ? 'tags|备忘内容' : 'tags|备忘标题' }
                        disabled={!edit && !modify}
                      />
                      :
                      currTags || currTags === 0 && datasource.tags.length ? datasource.tags[currTags].description : ''
                  }
                </View>
              </View>
            </View>
            {
              modify || edit ?
                <View className='modify_btn at-row at-row__align--center at-row__justify--center'>
                  <AtButton
                    size='small' type='primary' onClick={this.onBtnClick.bind(this)}>确认{modify ? '修改' : '添加'}</AtButton>
                </View>
                :
                null
            }

          </View>
        </AtFloatLayout>
        <NavMeau />
        <Modal />
      </View>

    )
  }
}

export default Index
