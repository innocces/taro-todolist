import Taro, { Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { onShow, changeTagStatus, delItems, modifyItems } from '../actions/todo'

import { AtIcon, AtFloatLayout, AtCard } from 'taro-ui'

import './tags.scss';

import tip from '../img/tip.png';

@connect(({ todo }) => ({
  todo
}), (dispatch) => ({
  onShow (payload) {
    dispatch(onShow(payload))
  },
  changeTagStatus(payload){
    dispatch(changeTagStatus(payload))
  },
  delItems(payload){
    dispatch(delItems(payload))
  },
  modifyItems(payload){
    dispatch(modifyItems(payload))
  }
}))

class Tags extends Component {

  constructor(){
    super(...arguments);
    this.state={
      isOpened : false,
      touchInfo : []
    }
  }
  

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    
  }

  componentDidMount(){
    
  }

  componentWillUnmount () { }

  onOpenFloat(index){
    this.setState({
      isOpened : true
    })
  }

  onClose(){
    this.setState({
      isOpened : false
    })
  }

  onTouchMove(i,event){
    let { clientX } = event.touches[0];
    let { touchInfo } = this.state;
    let offset = touchInfo[0] - clientX;
    if(offset >= 0 && offset <= 50){
      this.props.changeTagStatus({ index : i, left : -30, kind: 'tags' })
    }else if(offset < 0){
      this.props.changeTagStatus({ index : i, left : 20, kind: 'tags' })      
    }
  }

  onTouchStart(i,event){
    let { clientX, clientY } = event.touches[0];
    this.setState({
      touchInfo : [ clientX, clientY ]
    })
    // const query = Taro.createSelectorQuery().in(this.$scope);
    // let node = query.select(`.tag_item_${i}`)
    // node.fields({computedStyle:['left']},(res)=>{
    //     res.left}).exec((res)=>{console.log(res)})
  }

  // 删除tags，这里专门传递一下是为了阻止冒泡
  onDelItems(payload, event){
    event.stopPropagation()
    this.props.delItems(payload);
  }

  // 修改tags，这里专门传递一下是为了阻止冒泡
  onModifyItem(payload, event){
    event.stopPropagation()
    // this.props.modifyItems(payload);
    this.props.onShow({ showFloat : true, currTags : payload.index, modify: true })
  }

  render () {
    let { todo : { ipx , extend, datasource : { tags }  }  } = this.props;
    /*
     * reload 重新加载数据
     * tags: 打开tag
     * message: 创建备忘
     * bookmark: 创建待办事项
    */
    return (
      <View className='tags_content' style={{height:ipx ? 'calc(100vh - '+Taro.pxTransform(322)+')' : 'calc(100vh - '+Taro.pxTransform(264)+')'}}>
        { 
          tags.length ? 
          tags.map((v,i) => {
            let payload = { showFloat : true, currTags : i }, info = { kind : 'tags', index : i };
            return (
              <View className='tags_item' key={i} onClick={ this.props.onShow.bind( this, payload) }
                onTouchMove={this.onTouchMove.bind(this,i)}
                onTouchStart={this.onTouchStart.bind(this,i)}
              >
                <AtIcon value='tag' size='15' color='#6190E8' style={{backgroundColor:'#fff'}}></AtIcon>
                <View style={{left: v.left+'px'}} className={`tags_words tag_item_${i}`}>
                  { v.description.length > 30 ? v.summary : v.description }
                  <View className='tag_operator' onClick={ this.onModifyItem.bind(this, info) }>
                    <AtIcon value='edit' size='15' color='#6190E8' style={{backgroundColor:'#fff'}}></AtIcon>
                  </View>

                  <View className='tags_del' onClick={this.onDelItems.bind(this,info)}>删除</View>
                </View>  
              </View>
            )
          })
          :
          <View className='item_none'>
            <AtCard
              note='点击下方+可快速选择创建'
              // extra='额外信息'
              title='暂无Tags | 备忘'
              thumb={ tip }
            >
              快来创建一个Tags | 备忘试试吧~~
            </AtCard>
          </View>
        }
      </View>
    )
  }
}
export default Tags
