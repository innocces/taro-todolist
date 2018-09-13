import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { onShow } from '../actions/todo'

import { AtNavBar } from 'taro-ui'

import './header.scss';


@connect(({ todo }) => ({
  todo
}), (dispatch) => ({
  onShow (payload) {
    dispatch(onShow(payload))
  }
}))
class Header extends Component {

  constructor(){
    super(...arguments);
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    
  }

  componentDidMount(){
    
  }

  componentWillUnmount () { }

  onDrawShow(payload){
    let { onShow } = this.props;
    onShow(payload)
  }

  render () {
    let { todo : { ipx } } = this.props;
    return (
      <View className='header' 
        style={
          { paddingTop : ipx ? Taro.pxTransform(88) : Taro.getEnv() === 'WEAPP' ? Taro.pxTransform(40) : '0', 
            height: Taro.getEnv() === 'WEAPP' ? ipx ? Taro.pxTransform(176) : Taro.pxTransform(128) : Taro.pxTransform(88) }
            }
      >
        <AtNavBar
          onClickLeftIcon={this.onDrawShow.bind(this,{ show : true })}
          color='#6190E8'
          leftIconType="bullet-list"
          title='To Do List'
        />
      </View>
    )
  }
}

export default Header
