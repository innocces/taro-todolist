import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { onShow, addItems, modifyItems } from '../actions/todo'

import { AtCheckbox, AtCard, AtProgress, AtToast  } from 'taro-ui'

import './item.scss';

import tip from '../img/tip.png';
import success from '../img/success.png'


@connect(({ todo }) => ({
  todo
}), (dispatch) => ({
  onShow (payload) {
    dispatch(onShow(payload))
  },
  addItems(payload) {
    dispatch(addItems(payload))
  },
  modifyItems(payload){
    dispatch(modifyItems(payload))
  }
}))
class Items extends Component {

  constructor(){
    super(...arguments);
    this.state = {
      // selectedList : [],
      // progressStatus : {
      //   percent : 0,
      //   status : 'progress'
      // }
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    
  }

  componentDidMount(){
    let { todo : { datasource } } = this.props, selectedList = [];
    datasource.list.forEach((v,i) => {
      if(v.status){
        selectedList.push(i);
      };
    });
    this.props.onShow({
      selectedList,
      progressStatus : this.formateProgress(selectedList)
    })
  }

  componentWillUnmount () { }

  onItemChange(value){
    this.props.modifyItems({ checkList : value, kind : 'list' });
    this.props.onShow({
      selectedList : value,
      progressStatus : this.formateProgress(value)
    })
  }

  formateProgress(value){
    let { todo : { datasource } } = this.props, progressStatus = {};
    let list = datasource.list ? datasource.list : [];
    let progress = value.length ? Math.floor((value.length / list.length) * 100) : 0;
    progressStatus = {
      percent : progress,
      status : progress === 100 ? 'success' : 'progress'
    };
    if(progress === 100){
      this.props.onShow({ showToast : true })
    }
    return progressStatus;
  }


  render () {
    let { todo : { ipx , datasource, showToast, progressStatus, selectedList } } = this.props;
    let list = datasource.list ? datasource.list : [];
    // let list = [];
    list = list.map((v,i) => {
      /*
       * 这里组装成atcheckbox使用的数据
       * value === i
       * label === v.summary
       * desc === v.description
       * disabled === v.status
      */
      let currItem = {
        value : i ,
        label : v.summary,
        desc : v.description+'       '+v.time,
        disabled : v.status
      };
      
      return currItem;
    });
    

    return (
      <View>
        {
          list.length ? 
          <View className='item_content' style={{height:ipx ? 'calc(100vh - '+Taro.pxTransform(300)+')' : 'calc(100vh - '+Taro.pxTransform(264)+')'}}>
            <AtProgress percent={ progressStatus.percent } status={ progressStatus.status } />
            <AtCheckbox
              options = { list }
              selectedList={selectedList}
              onChange={this.onItemChange.bind(this)}
            />
            <AtToast
              isOpened={showToast}
              text='恭喜您完成所有待办事项'
              hasMask={true}
              image={success}
              onClose={this.props.onShow.bind(this, { showToast : false })}
              ></AtToast>
          </View>
          :
          <View className='item_none'>
            <AtCard
              note='点击下方+可快速选择创建'
              // extra='额外信息'
              title='暂无待办事项'
              thumb={ tip }
            >
              快来创建一个待办事项试试吧~~
            </AtCard>
          </View>
        }
      </View>
      
    )
  }
}

export default Items
