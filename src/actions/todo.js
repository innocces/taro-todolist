import {
  ONSHOW,
  MEAUCLICK,
  CHANGETAGSTATUS,
  ADDITEMS,
  DELITEMS,
  MODIFYITEMS
} from '../constants/counter'

// 修改多种状态 (其实是懒得改名字了)
export const onShow = (payload) => {
  return {
    type: ONSHOW,
    payload
  }
}

// 底部meau菜单逻辑
export const meauClick = (payload) => {
  return {
    type : MEAUCLICK,
    payload
  }
}

// 控制tag删除键显示隐藏  =。-
export const changeTagStatus = (payload) =>{
  return {
    type : CHANGETAGSTATUS,
    payload
  }
}

// 增加待办事项或tags
export const addItems = (payload) => {
  return {
    type : ADDITEMS,
    payload
  }
}

// 删除待办事项或tags
export const delItems = (payload) => {
  return {
    type : DELITEMS,
    payload
  }
}

// 修改待办事项或tags
export const modifyItems = (payload) => {
  return {
    type : MODIFYITEMS,
    payload
  }
}
