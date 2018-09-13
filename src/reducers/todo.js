import {
  ONSHOW,
  MEAUCLICK,
  CHANGETAGSTATUS,
  ADADDITEMS,
  DELITEMS,
  MODIFYITEMS,
  ADDITEMS
} from '../constants/counter'
import Taro from '@tarojs/taro';
import { formateTime, getDatasource, setDatatsource } from '../utils'
import { addItems } from '../actions/todo';

// let data = { "tags": 
//   [{ "summary": "测试数据一号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据2号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据3号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }, 
//   { "summary": "测试数据5号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", "left": 20 }], 
//   "list": [
//     {  "summary": "测试数据一号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45", status: false },
//     {  "summary": "测试数据2号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据3号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: true},
//     {  "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据4号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false},
//     {  "summary": "测试数据5号....", "description": "测试数据聚聚聚聚聚聚聚", "time": "2018/9/11 9:59:45" , status: false}
//   ] };

//   data.tags = data.tags.map(v=>{v.title = v.summary;return v});
// Taro.setStorageSync('datasource', JSON.stringify(data));

let systemInfo = Taro.getSystemInfoSync();
let { model } = systemInfo;
let reg = /iPhone X/;
let ipx = false;
if (reg.test(model) && Taro.getEnv() === 'WEAPP') {
  ipx = true
};

const INITIAL_STATE = {
  show: false,
  ipx,
  extend: false,
  currTags: null,
  showFloat: false,
  current: 0,
  showModal: false,
  kind: 'messages',
  edit: false,
  datasource: getDatasource() ? getDatasource() : {},
  showLoading: false,
  modify: false,
  tabcurrent: 0,
  showToast : false,
  selectedList : [],
  progressStatus : {
    percent : 0,
    status : 'progress'
  }
}

// 判断不同类型meau做出不一样的判断渲染
function analysisAction(type, state) {
  /*
   * reload 重新加载数据
   * tags: 打开tag
   * message: 创建备忘
   * bookmark: 创建待办事项
  */
  let extroState = {};
  switch (type) {
    case 'reload': // 暂定重新拉取数据。。。。 
      extroState = {
        datasource: getDatasource()
      };
      break;
    case 'tags':
      extroState = {
        current: 1
      }
      break;
    case 'message':
      extroState = {
        current: 0,
        showModal: true,
        kind: 'messages',
        edit: true
      }
      break;
    case 'bookmark':
      extroState = {
        current: 1,
        showFloat: true,
        kind: 'tags',
        edit: true
      };
      break;
  }
  return {
    ...state,
    ...extroState,
    extend: false
  }
}

function handlerDataSource(payload, state, way) {
  let { kind, index, items, checkList } = payload, { datasource } = state, progressStatus= {};
  switch (way) {
    case 'del':
      datasource[kind] = datasource[kind].filter((v, i) => i !== index);
      break;
    case 'modify':
      datasource[kind] = datasource[kind].map((v, i) => {
        if(kind === 'list' && checkList.includes(i)){
          v.status = true;
        }else if (i === index && kind === 'tags') {
          v = items;
        }
        return v;
      });
      break;
    case 'add':
      datasource[kind].push(items);
      if(kind === 'list'){
        let _data = state.datasource.list, select = state.selectedList;
        let progress = _data.length ? Math.floor((select.length / _data.length) * 100) : 0;
        progressStatus = {
          percent : progress,
          status : progress === 100 ? 'success' : 'progress'
        };
        console.log(state)
      }
      break;
  }
  // 更新一下本地存储
  setDatatsource(datasource);
  let currState = {
    ...state,
    datasource,
    currTags : null
  };
  if(way === 'add' && kind === 'list'){
    currState = {
      ...currState,
      progressStatus
    }
  }
  return currState
}

export default function todo(state = INITIAL_STATE, action) {
  let { type, payload } = action;
  switch (type) {
    case ONSHOW:
      console.log(action)
      return {
        ...state,
        ...payload
      }
    case MEAUCLICK:
      return analysisAction(payload, state);
    case CHANGETAGSTATUS:
      let { index, left, kind } = payload, { datasource } = state;
      datasource[kind] = datasource[kind].map((v, i) => {
        if (i === index) {
          v.left = left;
        }
        return v;
      });
      return {
        ...state,
        datasource
      }
    case DELITEMS:
      return handlerDataSource(payload, state, 'del')
    case MODIFYITEMS:
      return handlerDataSource(payload, state, 'modify')
    case ADDITEMS:
      return handlerDataSource(payload, state, 'add')
    default:
      return state
  }
}

