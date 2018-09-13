import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { onShow, meauClick } from '../actions/todo'

import { AtIcon  } from 'taro-ui'

import './navMeau.scss';


@connect(({ todo }) => ({
  todo
}), (dispatch) => ({
  onShow (payload) {
    dispatch(onShow(payload))
  },
  meauClick (payload) {
    dispatch(meauClick(payload))
  }
}))
class NavMeau extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    
  }

  componentDidMount(){
    
  }

  componentWillUnmount () { }

  // meau 点击事件
  onMeauClick(type){

  }

  render () {
    let { todo : { ipx , extend } } = this.props;
    let iconList = ['reload','tags','message','bookmark'];
    /*
     * reload 重新加载数据
     * tags: 打开tag
     * message: 创建备忘
     * bookmark: 创建待办事项
    */
    return (
      <View className='navMeau'>
        <View className={extend ? 'nav_main active' : 'nav_main'} onClick={this.props.onShow.bind(this,{ extend : extend ? false : true })}><AtIcon value='add-circle' size='40' color='#6190E8'></AtIcon></View>
        {
          iconList.map((v,i) => (
            <View className={extend ? 'nav_list active' : 'nav_list'} key={i} onClick={this.props.meauClick.bind(this,v)}><AtIcon value={v} size='40' color='#6190E8'></AtIcon></View>
          ))
        }
      </View>
    )
  }
}

export default NavMeau
