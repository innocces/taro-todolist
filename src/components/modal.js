import Taro, { Component } from '@tarojs/taro'
import { Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { onShow, addItems } from '../actions/todo'

import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtTextarea } from 'taro-ui'

import './modal.scss';
import { formateTime } from '../utils';


@connect(({ todo }) => ({
  todo
}), (dispatch) => ({
  onShow(payload) {
    dispatch(onShow(payload))
  },
  addItems(payload){
    dispatch(addItems(payload))
  }
}))

class Modal extends Component {
  constructor(){
    super(...arguments);
    this.state={
      value:'',
      currItem:{}
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() { }

  onValueChange(event) {
    let value = event.currentTarget.value;
    this.setState({
      value
    })
  }

  onAddItems(){
    let { value, currItem } = this.state;
    if(!value.length){
      this.props.onShow({ showModal : false })
      return;
    }
    currItem = {
      summary : value.length > 15 ? value.slice(0,15)+'...' : value,
      description: value,
      time : formateTime(),
      status : false
    };
    this.props.addItems({ kind: 'list', items: currItem });
    this.onCancel()
  }

  onCancel(){
    this.props.onShow({ showModal: false });
    this.setState({
      value : '',
      currItem : {}
    })
  }
  render() {
    let { todo: { showModal, kind, edit } } = this.props;
    // console.log('modal:'+showModal)
    /*
     * reload 重新加载数据
     * tags: 打开tag
     * message: 创建备忘
     * bookmark: 创建待办事项
    */
    return (
      <AtModal isOpened={showModal}>
        <AtModalHeader>添加{kind === 'tags' ? 'tags' : '待办事项'}</AtModalHeader>
        <AtModalContent>
          {
            showModal ?
              (
                <AtTextarea
                  value={this.state.value}
                  onChange={this.onValueChange.bind(this)}
                  maxlength='40'
                  autoFocus={true}
                  placeholder='待办事项内容...'
                  disabled={!edit}
                />
              )
              :
              null
          }
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.onCancel.bind(this)}>取消</Button>
          <Button onClick={this.onAddItems.bind(this)}>确定</Button>
        </AtModalAction>
      </AtModal>
    )
  }
}


export default Modal
