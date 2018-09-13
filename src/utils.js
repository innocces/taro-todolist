import Taro from '@tarojs/taro';

export function formateTime(){
  let date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].join('/') + ' ' + [hour, minute, second].join(':')
}

export function getDatasource(){
  let datasource;
  try{
    datasource = JSON.parse(Taro.getStorageSync('datasource'))
  }catch(e){
    console.log(e)
    datasource = {
      tags:[],
      list:[]
    };
  }
  return datasource;
}

export function setDatatsource(datasource){
  try{
    datasource = JSON.stringify(datasource);
    Taro.setStorageSync('datasource',datasource);
  }catch(e){
    console.error('储存失败');
  }
}