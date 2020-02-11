import { observable } from 'mobx'
import Taro from '@tarojs/taro'
import tp from '../utils/timePercent'

const { timePercent } = tp

const themeStore = observable({
  statusBarHeight: 20,
  systemInfo: {
    statusBarHeight: 20,
    model: 'iPhone X',
    windowWidth: 375
  },
  navBarTitle: '亦时',
  isDark: false,
  birthday: '1993,3,1',
  avglife: 77,
  explife: 0,
  list: [
    {
      name: '年进度',
      title:'',
      percent: 0,
      icon: 'earth',
      color: '#D8000C',
      selected: true,
      editable: false,
      type: 'year'
    },
    {
      name: '月进度',
      title:'',
      percent: 0,
      icon: 'moon',
      color: '#00CCEB',
      selected: true,
      editable: false,
      type: 'month'
    },
    {
      name: '周进度',
      title:'',
      percent: 0,
      icon: 'week',
      color: '#00CA94',
      selected: false,
      editable: false,
      type: 'week'
    },
    {
      name: '日进度',
      title:'',
      percent: 0,
      icon: 'sun',
      color: '#FFBF65',
      selected: true,
      editable: false,
      type: 'day'
    },
    {
      name: '人生进度',
      title:'',
      percent: 0,
      icon: 'face',
      color: '#FF5680',
      selected: false,
      editable: false,
      type: 'life'
    }
  ],
  updateTime: Date.now(),

  // 已封装的云函数
  getDbFn(fn, param) {
    return Taro.cloud.callFunction({
       name: 'dao',
       data: { fn, param }
    })
  },

  // 更新数据列表
  updateList() {
    let life = this.explife ? this.explife : this.avglife
    let date1 = new Date(this.birthday)
    let midDate = new Date(this.birthday)
    let date2 = new Date(midDate.setFullYear(midDate.getFullYear() + life))
    console.log(date1, date2, life)
    return this.list
    .map(
      item => {
        let tpobj = {}
        if (item.type == 'life') {
          tpobj = timePercent('life', date1, date2)
        } else {
          tpobj = timePercent(item.type)
        }
        return {
          type: item.type,
          name: item.name,
          title: this.getName(item.type, tpobj.time),
          icon: item.icon,
          color: item.color,
          selected: item.selected,
          editable: false,
          time: tpobj.time,
          percent: tpobj.percent
        }
      }
    )
  },

  // 返回标题
  getName(type, time) {
    let name = ''
    let week = ['日', '一', '二', '三', '四', '五', '六']
    switch(type) {
      case 'year':
        name = time + '年，本年已过去 '
        break
      case 'month':
        name = time + '月，本月已过去 '
        break
      case 'week':
        name = '星期' + week[time] + '，本周已过去 '
        break
      case 'day':
        name = time + '日，本日已过去 '
        break
      case 'life':
        name = time + '岁，预期人生已过去 '
        break
    }
    return name
  },

  // 初始化数据
  setInitData() {
    let list = this.updateList()
    this.setListData(list, Date.now(), true)
    this.setDarkMode(false)
  },

  // 超过9分钟便更新数据
  setUpdateData(updateTime) {
    let timeDiff = (Date.now() - updateTime)/(60*1000)
    if (timeDiff > 9) {
      let list = this.updateList()
      this.setListData(list, Date.now(), false)
    } else {
      Taro.getStorage({key: 'list'})
      .then(
        res => {
          this.list = res.data
        }
      )
    }
  },

  // 获取云端数据
  getUserData() {
    this.getDbFn('getUserData', {})
    .then(
      res => {
        if (res.result.data.length > 0) {
          let obj = res.result.data[0]
          this.setDarkMode(obj.isDark)
          this.setLocalListData(obj.list, obj.updateTime)
          this.setUpdateData(obj.updateTime)
        } else {
          this.setInitData()
        }
      }
    )
    .catch(
      this.setInitData()
    )
  },

  // 切换黑暗模式
  toggleDarkMode() {
    this.isDark = !this.isDark
    this.setNavBarColor(this.isDark)
    Taro.setStorage({key: 'isDark', data: this.isDark})
    this.getDbFn('setDarkMode', {isDark: this.isDark})
  },
  setDarkMode(isDark) {
    this.isDark = isDark
    this.setNavBarColor(isDark)
    Taro.setStorage({key: 'isDark', data: isDark})
  },

  // 导航栏前景背景色
  setNavBarColor(isDark) {
    Taro.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#333333' : '#ffffff'
    })
  },

  // 系统信息
  getSystemInfo() {
    Taro.getStorage({key: 'systemInfo'})
    .then(
      res => this.systemInfo = res.data
    )
    .catch(
      () => Taro.getSystemInfo()
      .then(
        res => {
          this.systemInfo = res
          Taro.setStorage({key: 'systemInfo', data: res})
        }
      )
    )
  },

  setStatusBarHeight(height, isFirst) {
    this.statusBarHeight = height
    if (isFirst) Taro.setStorage({key: 'statusBarHeight', data: height})
  },

  setNavBarTitle(title) {
    this.navBarTitle = title
    Taro.setStorage({key: 'navBarTitle', data: title})
  },

  setLocalListData(list, updateTime) {
    this.list = list
    this.updateTime = updateTime
    Taro.setStorage({key: 'list', data: list})
    Taro.setStorage({key: 'updateTime', data: updateTime})
  },
  setListData(list, updateTime, isFirst) {
    this.list = list
    this.updateTime = updateTime
    Taro.setStorage({key: 'list', data: list})
    Taro.setStorage({key: 'updateTime', data: updateTime})
    isFirst ? 
    this.getDbFn('setInitData', {list, updateTime})
    .then(
      res => console.log(res)
    ) :
    this.getDbFn('setListData', {list, updateTime})
    .then(
      res => console.log(res)
    )
  },
  getListData() {
    Taro.getStorage({key: 'updateTime'})
    .then(
      res => {
        this.updateTime = res.data
        this.setUpdateData(res.data)
        Taro.getStorage({key: 'isDark'})
        .then(
          res => {
            this.isDark = res.data
            this.setNavBarColor(res.data)
          }
        )
      }
    )
    .catch(
      () => {
        this.getUserData()
      }
    )
  }
})
export default themeStore