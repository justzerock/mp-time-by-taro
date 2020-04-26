import { observable } from 'mobx'
import Taro from '@tarojs/taro'
import tp from '../utils/timePercent'

const { timePercent } = tp

const themeStore = observable({
  // 导航栏信息
  navInfo: {
    navTop: '20PX',
    navHeight: '44PX',
    menuWidth: '95PX',
    menuHeight: '40PX',
    menuTop: '22PX',
    menuLeft: '274PX',
    windowWidth: 375,
    windowHeight: 667
  },  
  // 分享时显示
  isShare: false,
  // 主题色
  primary: '#7789A1', 
  // 预设颜色值
  colors: [
    '#7789A1',
    '#5C8AC1',
    '#4D89FB',
    '#FF5C5D',
    '#FFBF65',
    '#FF5680',
    '#00CCEB',
    '#00CA94',
    '#329188',
  ], 
  // 统一使用主题色
  usePrimary: false, 
  // 标题
  navBarTitle: '亦时', 
  // 是否为右侧页面 
  isRight: false, 
  // 是否为暗色模式
  isDark: false,  
  // 是否有HomeBar
  hasHomeBar: false,  
  // 生日
  birthday: '', 
  // 平均寿命
  avglife: 77,  
  // 期望寿命
  explife: 0, 
  // 每周起始日
  weekStartDay: 0,  
  // 默认显示详情
  isDetail: true, 
  // 预设值
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
      color: '#FF5C5D',
      selected: true,
      type: 'life',
      detail: 0
    }
  ],  

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
        name = time + ' 岁，人生已过去 ' + detail + ' 天\n目标 ' + (this.explife ? this.explife : this.avglife) + ' 岁'
        break
    }
    return name
  },

  // 初始化数据
  setInitData() {
    let list = this.updateList()
    this.setListData(list, true)
    this.setDarkMode(false)
  },

  // 更新数据
  setUpdateData() {
    let list = this.updateList()
    this.setListData(list, false)
  },

  // 获取云端数据
  getUserData() {
    this.getDbFn('getUserData', {})
    .then(
      res => {
        if (res.result.data.length > 0) {
          let obj = res.result.data[0]
          this.setDarkMode(obj.isDark)
          this.setPrimaryColor(obj.primary, true)
          this.setUsePrimary(obj.usePrimary, true)
          this.setBirthDay(obj.birthday, true)
          this.setExpLife(obj.explife, true)
          this.setWeekStartDay(obj.weekStartDay, true)
          this.setViewMode(obj.isDetail, true)
          this.setLocalListData(obj.list)
          this.setUpdateData()
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
  setPrimaryColor(primary, isFirst) {
    this.primary = primary
    Taro.setStorage({key: 'primary', data: primary})
    if(!isFirst) this.getDbFn('setPrimaryColor', {primary})
  },

  // 获取主题色
  getPrimaryColor() {
    Taro.getStorage({key: 'primary'})
    .then(
      res => this.primary = res.data
    )
    .catch(
      () => this.setPrimaryColor(this.primary, true)
    )
  },

  // 统一使用主题色
  setUsePrimary(usePrimary, isFirst) {
    this.usePrimary = usePrimary
    Taro.setStorage({key: 'usePrimary', data: usePrimary})
    if(!isFirst) this.getDbFn('setUsePrimary', {usePrimary})
  },

  // 统一使用主题色
  getUsePrimary() {
    Taro.getStorage({key: 'usePrimary'})
    .then(
      res => this.usePrimary = res.data
    )
    .catch(
      () => this.setUsePrimary(this.usePrimary, true)
    )
  },

  // 设置期望寿命
  setExpLife(explife, isFirst) {
    this.explife = explife
    Taro.setStorage({key: 'explife', data: explife})
    if(!isFirst) this.getDbFn('setExpLife', {explife})
  },

  // 获取期望寿命
  getExpLife() {
    Taro.getStorage({key: 'explife'})
    .then(
      res => this.explife = res.data
    )
    .catch(
      () => this.setExpLife(0, true)
    )
  },

  // 设置生日
  setBirthDay(birthday, isFirst) {
    this.birthday = birthday
    Taro.setStorage({key: 'birthday', data: birthday})
    if(!isFirst) this.getDbFn('setBirthDay', {birthday})
  },

  // 获取生日
  getBirthDay() {
    Taro.getStorage({key: 'birthday'})
    .then(
      res => this.birthday = res.data
    )
    .catch(
      () => this.setBirthDay('', true)
    )
  },

  // 设置周首日
  setWeekStartDay(weekStartDay, isFirst) {
    this.weekStartDay = weekStartDay
    Taro.setStorage({key: 'weekStartDay', data: weekStartDay})
    if(!isFirst) this.getDbFn('setWeekStartDay', {weekStartDay})
  },

  // 获取周首日
  getWeekStartDay() {
    Taro.getStorage({key: 'weekStartDay'})
    .then(
      res => this.weekStartDay = res.data
    )
    .catch(
      () => this.setWeekStartDay(0, true)
    )
  },

  // 设置视图显示详情
  setViewMode(isDetail, isFirst) {
    this.isDetail = isDetail
    Taro.setStorage({key: 'isDetail', data: isDetail})
    if(!isFirst) this.getDbFn('setViewMode', {isDetail})
  },

  // 获取视图设置
  getViewMode() {
    Taro.getStorage({key: 'isDetail'})
    .then(
      res => this.isDetail = res.data
    )
    .catch(
      () => this.setViewMode(true, true)
    )
  },

  // 设置导航栏尺寸
  getNavInfo() {
    Taro.getStorage({key: 'navInfo'})
    .then(
      res => {
        this.navInfo = res.data
        this.setHomeBar(res.data.model)
      }
    )
    .catch(
      () => {
        let sysInfo
        let menuInfo
        try {
          sysInfo = Taro.getSystemInfoSync()
          menuInfo = Taro.getMenuButtonBoundingClientRect()
        } catch (error) {
          sysInfo = {
            statusBarHeight: 20,
            model: 'iPhone',
            windowWidth: 375,
            windowHeight: 667
          }
          menuInfo = {
            width: 87,
            height: 32,
            top: 26,
            bottom: 58,
            left: 278,
            right: 365
          }
        }
        let navInfo = {
          navTop: sysInfo.statusBarHeight + 'PX',
          navHeight: (menuInfo.top - sysInfo.statusBarHeight)*2 + menuInfo.height + 'PX',
          menuWidth: menuInfo.width + 8 + 'PX',
          menuHeight: menuInfo.height + 8 + 'PX',
          menuTop: menuInfo.top - 4 + 'PX',
          menuLeft: menuInfo.left - 4 + 'PX',
          model: sysInfo.model,
          windowWidth: sysInfo.windowWidth,
          windowHeight: sysInfo.windowHeight
        }
        this.navInfo = navInfo
        this.setHomeBar(navInfo.model)
        Taro.setStorage({key: 'navInfo', data: navInfo})
      }
    )
  },

  //  用于判断底部空间
  setHomeBar(model) {
    if (model.search('iPhone X') !== -1 || model.search('iPhone 1') !== -1) {
      this.hasHomeBar = true
    }
  },

  // 设置标题
  setNavBarTitle(title, isRight) {
    this.navBarTitle = title
    this.isRight = isRight
  },

  // 将list存到本地
  setLocalListData(list) {
    this.list = list
    Taro.setStorage({key: 'list', data: list})
  },
  // 更新list
  setListData(list, isFirst) {
    this.list = list
    Taro.setStorage({key: 'list', data: list})
    isFirst ? 
    this.getDbFn('setInitData', {list})
    .then(
      () => console.log('初始化数据')
    ) :
    this.getDbFn('setListData', {list})
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
        this.setUpdateData()
      }
    )
    .catch(
      () => this.getUserData()
    )
  }
})
export default themeStore