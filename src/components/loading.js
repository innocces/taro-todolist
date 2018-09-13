import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { onShow, meauClick } from '../actions/todo'

import { AtActivityIndicator } from 'taro-ui'

import './navMeau.scss';


@connect(({ todo }) => ({
  todo
}))

class Loading extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    
  }

  componentDidMount(){
    
  }

  componentWillUnmount () { }

  render () {
    return (
      <View className='loading'>
        <AtActivityIndicator mode='center' content='请稍候'></AtActivityIndicator>
      </View>
    )
  }
}

export default Loading
