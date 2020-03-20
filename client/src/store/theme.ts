import { observable } from 'mobx'
import Taro from '@tarojs/taro'
import tp from '../utils/timePercent'

const { timePercent } = tp

const themeStore = observable({
  systemInfo: {
    statusBarHeight: 20,
    model: 'iPhone',
    windowWidth: 375
  },
  menuButton: {
    width: 87,
    height: 32,
    top: 26,
    bottom: 58,
    left: 278,
    right: 365
  },
  primary: '#7789A1',
  colors: [
    '#7789A1',
    '#329188',
    '#5C8AC1',
    '#FF5C5D',
    '#FFA054',
    '#73C2FC',
    '#5574E3',
    '#33DFE6',
    '#5FDFB7',
  ],
  navBarTitle: '亦时',
  isRight: false,
  isDark: false,
  hasHomeBar: false,
  birthday: '',
  avglife: 77,
  explife: 0,
  weekStartDay: 0,
  isDetail: true,
  list: [
    {
      name: '年进度',
      title:'',
      percent: 0,
      icon: 'earth',
      color: '#4D89FB',
      selected: false,
      type: 'year',
      detail: 0
    },
    {
      name: '月进度',
      title:'',
      percent: 0,
      icon: 'moon',
      color: '#00CCEB',
      selected: false,
      type: 'month',
      detail: 0
    },
    {
      name: '周进度',
      title:'',
      percent: 0,
      icon: 'week',
      color: '#00CA94',
      selected: false,
      type: 'week',
      detail: 0
    },
    {
      name: '日进度',
      title:'',
      percent: 0,
      icon: 'sun',
      color: '#FFBF65',
      selected: false,
      type: 'day',
      detail: 0
    },
    {
      name: '人生进度',
      title:'',
      percent: 0,
      icon: 'birth',
      color: '#FF5680',
      selected: true,
      type: 'life',
      detail: 0
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
    let date1
    let midDate
    let date2 
    if ( this.birthday !== '' ) {
      date1 = new Date(this.birthday.replace(/-/g, '/'))
      midDate = new Date(this.birthday.replace(/-/g, '/'))
      date2 = new Date(midDate.setFullYear(midDate.getFullYear() + life))
    }
    return this.list
    .map(
      item => {
        let tpobj
        let type = item.type
        if (type === 'week' ) {
          tpobj = timePercent(type, this.weekStartDay)
        } else if (type === 'life') {
          tpobj = this.birthday === '' ? {time:0, percent:0, detail:0} : timePercent(type, 0, date1, date2)
        } else {
          tpobj = timePercent(type)
        }
        return {
          type: type,
          name: item.name,
          title: this.getName(type, tpobj.time, tpobj.detail),
          icon: item.icon,
          color: item.color,
          selected: item.selected,
          time: tpobj.time,
          percent: tpobj.percent
        }
      }
    )
  },

  // 返回标题
  getName(type, time, detail) {
    let name = ''
    let week = ['日', '一', '二', '三', '四', '五', '六']
    switch(type) {
      case 'year':
        name = time + ' 年，本年已过去 ' + detail + ' 天'
        break
      case 'month':
        name = time + ' 月，本月已过去 ' + detail + ' 天'
        break
      case 'week':
        name = '星期' + week[time] + '，本周已过去 ' + detail + ' 天'
        break
      case 'day':
        name = time + ' 日，本日已过去 ' + detail + ' 小时'
        break
      case 'life':
        name = time + ' 岁，人生已过去 ' + detail + ' 天，目标 ' + (this.explife ? this.explife : this.avglife) + ' 岁'
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

  // 超过10分钟便更新数据
  setUpdateData(updateTime, force) {
    let list = this.updateList()
    this.setListData(list, Date.now(), false)
    /* if (force) {
    } else {
      let timeDiff = (Date.now() - updateTime)/(60*1000)
      if (timeDiff > 10) {
        this.setListData(list, Date.now(), false)
      } else {
        Taro.getStorage({key: 'list'})
        .then(
          res => {
            this.list = res.data
          }
        )
      }
    } */
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
          this.setUpdateData(obj.updateTime, false)
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
    //this.getDbFn('setDarkMode', {isDark: this.isDark})
  },
  setDarkMode(isDark) {
    this.isDark = isDark
    this.setNavBarColor(isDark)
    Taro.setStorage({key: 'isDark', data: isDark})
  },
  getDarkMode() {
    Taro.getStorage({key: 'isDark'})
    .then(
      res => {
        this.isDark = res.data
        this.setNavBarColor(res.data)
      }
    )
    .catch(
      () => this.setDarkMode(false)
    )
  },

  // 导航栏前景背景色
  setNavBarColor(isDark) {
    Taro.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: isDark ? '#233541' : '#dde1e7'
    })
  },

  // 设置主题色
  setPrimaryColor(color) {
    this.primary = color
    Taro.setStorage({key: 'primary', data: color})
  },

  // 获取主题色
  getPrimaryColor() {
    Taro.getStorage({key: 'primary'})
    .then(
      res => this.primary = res.data
    )
    .catch(
      () => this.setPrimaryColor(this.primary)
    )
  },

  // 设置期望寿命
  setExpLife(life) {
    this.explife = life
    Taro.setStorage({key: 'explife', data: life})
  },

  // 获取期望寿命
  getExpLife() {
    Taro.getStorage({key: 'explife'})
    .then(
      res => this.explife = res.data
    )
    .catch(
      () => this.setExpLife(0)
    )
  },

  // 设置生日
  setBirthDay(date) {
    this.birthday = date
    Taro.setStorage({key: 'birthday', data: date})
  },

  // 获取生日
  getBirthDay() {
    Taro.getStorage({key: 'birthday'})
    .then(
      res => this.birthday = res.data
    )
    .catch(
      () => this.setBirthDay('')
    )
  },

  // 设置周首日
  setWeekStartDay(day) {
    this.weekStartDay = day
    Taro.setStorage({key: 'weekStartDay', data: day})
  },

  // 获取周首日
  getWeekStartDay() {
    Taro.getStorage({key: 'weekStartDay'})
    .then(
      res => this.weekStartDay = res.data
    )
    .catch(
      () => this.setWeekStartDay(0)
    )
  },

  // 设置视图显示详情
  setViewMode(isDetail) {
    this.isDetail = isDetail
    Taro.setStorage({key: 'isDetail', data: isDetail})
  },

  // 获取视图设置
  getViewMode() {
    Taro.getStorage({key: 'isDetail'})
    .then(
      res => this.isDetail = res.data
    )
    .catch(
      () => this.setViewMode(true)
    )
  },

  //  获取菜单按钮信息
  getMenuButton() {
    Taro.getStorage({key: 'menuButton'})
    .then(
      res => this.menuButton = res.data
    )
    .catch(
      () => {
        try {
          let menuButton = Taro.getMenuButtonBoundingClientRect()
          this.menuButton = menuButton
          Taro.setStorage({key: 'menuButton', data: menuButton})
        } catch (error) {
          console.log(error)
        }
      }
    )
  },

  //  用于判断底部空间
  setHomeBar(model) {
    if (model.search('iPhone X') !== -1 || model.search('iPhone 11') !== -1) {
      this.hasHomeBar = true
    }
  },

  // 系统信息
  getSystemInfo() {
    Taro.getStorage({key: 'systemInfo'})
    .then(
      res => {
        this.systemInfo = res.data
        this.setHomeBar(res.data.model)
      } 
    )
    .catch(
      () => Taro.getSystemInfo()
      .then(
        res => {
          this.systemInfo = res
          this.setHomeBar(res.model)
          Taro.setStorage({key: 'systemInfo', data: res})
        }
      )
    )
  },

  // 设置标题
  setNavBarTitle(title, isRight) {
    this.navBarTitle = title
    this.isRight = isRight
  },

  // 将list存到本地
  setLocalListData(list, updateTime) {
    this.list = list
    this.updateTime = updateTime
    Taro.setStorage({key: 'list', data: list})
    Taro.setStorage({key: 'updateTime', data: updateTime})
  },
  // 更新list
  setListData(list, updateTime, isFirst) {
    this.list = list
    this.updateTime = updateTime
    Taro.setStorage({key: 'list', data: list})
    Taro.setStorage({key: 'updateTime', data: updateTime})
    isFirst ? 
    this.getDbFn('setInitData', {list, updateTime})
    .then(
      () => console.log('初始化数据')
    ) :
    this.getDbFn('setListData', {list, updateTime})
    .then(
      () => console.log('更新数据')
    )
  },
  // 获取本地或云端list
  getListData() {
    Taro.getStorage({key: 'list'})
    .then(
      res => {
        this.list = res.data
        this.setUpdateData(0, true)
      }
    )
    .catch(
      () => this.getUserData()
    )
  }
})
export default themeStore