export default {
  pages: ['pages/index/index', 'pages/tool/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '精巧待办事项',
    navigationBarTextStyle: 'black',
  },
  style: 'v2',
  tabBar: {
    color: '#dbdbdb',
    selectedColor: '#ee0a24',
    borderStyle: 'white',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '待办事项',
        iconPath: './image/todolist.png',
        selectedIconPath: './image/todolist-select.png',
      },
      {
        pagePath: 'pages/tool/index',
        text: '工具合集',
        iconPath: './image/tools.png',
        selectedIconPath: './image/tools-select.png',
      },
    ],
  },
};
