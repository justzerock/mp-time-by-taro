// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Input } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'
import { is } from 'immutable'

import MyIcon from '../MyIcon/MyIcon'
import MySwitch from '../MySwitch/MySwitch'
import './MySettingList.scss'

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    isDetail: boolean,
    primary: string,
    usePrimary: boolean,
    useCloudSync: boolean,
    colors: Array<string>,
    weekStartDay: number,
    systemInfo: object,
    birthday: string,
    avglife: number,
    explife: number,
    toggleDarkMode: Function,
    setDarkMode: Function,
    setPrimaryColor: Function,
    setUsePrimary: Function,
    setExpLife: Function,
    setBirthDay: Function,
    setUpdateData: Function,
    setWeekStartDay: Function,
    setViewMode: Function,
    setUseCloudSync: Function
  },
  isShow: boolean,
  hasHomeBar: boolean,
  onHide: Function
}

interface MySettingList {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MySettingList extends Component {
  static defaultProps = {
    themeStore: {
      isDark: false,
      isDetail: false,
      primary: '#5a5a5a',
      usePrimary: false,
      useCloudSync: true,
      colors: [],
      weekStartDay: 0,
      systemInfo: {},
      birthday: '',
      avglife: 77,
      explife: 0,
    },
    isShow: false,
    hasHomeBar: false
  }
  state = {
    isFocus: false
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentWillMount () {}

  componentDidMount () {}
  
  componentWillUnmount () {}
  
  componentDidShow () {}
  
  componentDidHide () {}

  componentWillReact () {}

  // 设置出生年月
  onDateChange(e) {
    const { themeStore } = this.props
    const today = this.dateToString(new Date())
    let birthday = e.detail.value
    let now = Date.now()
    let birth = new Date(birthday).getTime()
    birthday = now > birth ? birthday : today 
    themeStore.setBirthDay(birthday, false)
    themeStore.setUpdateData()
  }

  // 转换日期格式
  dateToString(date) {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + month + '-' + day
  }

  // 输入寿命聚焦
  onLifeFocus() {
    this.setState({
      isFocus: true
    })
  }

  // 设置寿命输入时
  onLifeInput(e) {
    let life = e.detail.value
    if (life > 999) {
      life = 999
    }
    return life
  }

  // 设置寿命失焦时
  onLifeBlur(e) {
    const { themeStore } = this.props
    let life = e.detail.value
    life = life > 999 ? 999 : life < 1 ? 1 : life
    themeStore.setExpLife(Number(life), false)
    themeStore.setUpdateData()
    this.setState({
      isFocus: false
    })
  }

  // hex 转 rgb
  hexToRgb = (hex)=> {
    hex = hex.slice(1)
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return r + "," + g + "," + b;
  }

  // 设置使用主题色
  setUsePrimary() {
    const { themeStore } = this.props
    themeStore.setUsePrimary(!themeStore.usePrimary, false)
  }

  // 使用云同步
  setUseCloudSync() {
    const { themeStore } = this.props
    themeStore.setUseCloudSync(!themeStore.useCloudSync)
  }

  // 设置周起始日
  setWeekStartDay(day) {
    const { themeStore } = this.props
    if (is(day, themeStore.weekStartDay)) return
    themeStore.setWeekStartDay(day, false)
  }

  // 设置视图模式
  setViewMode(isDetail) {
    const { themeStore } = this.props
    if (is(isDetail, themeStore.isDetail)) return
    themeStore.setViewMode(isDetail, false)
  }

  // 设置主题色
  setPrimaryColor(color) {
    const { themeStore } = this.props
    if( is(color, themeStore.primary) ) {
      return
    } else {
      themeStore.setPrimaryColor(color, false)
    }
  } 

  render () {
    const { 
      themeStore: { 
        isDark, isDetail, primary, usePrimary, useCloudSync, birthday, explife, avglife, colors, weekStartDay 
      }, 
      isShow, onHide, hasHomeBar 
    } = this.props
    const { isFocus } = this.state
    const classDark = isDark ? 'dark' : 'light'

    const stylePage = `
      --primary-rgb: ${this.hexToRgb(primary)};
      --primary: ${hexToRgba(primary, 0.6)};
      --padding-bottom: ${hasHomeBar ? '44PX' : '10PX'}
    `

    return (
      <View
        className={`setting-list ${classDark} ${isShow ? 'show' : ''}`}
        style={stylePage}
      >
        <View
          className={`list-title`}
        >
          <View
            className={`title-name`}
          >
            <View
              className={`title-icon`}
            >
              <MyIcon 
                name='setting'
              />
            </View>
            设置进度条
          </View>
          <View
            className={`title-action`}
            onClick={onHide}
          >
            <MyIcon
              name='close'
            />
          </View>
        </View>
        <View
          className={`setting-item`}
        >
          <View
            className={`item-title`}
          >
            我的生日
          </View>
          <View
            className={`item-action ${classDark}`}
          >
            <Picker
              mode='date'
              start='1900-01-01'
              value={ is(birthday, '') ? this.dateToString(new Date()) : birthday}
              end={this.dateToString(new Date())}
              onChange={this.onDateChange}
              className='birth-day'
            >
              <View className='picker'>
                {is(birthday, '')  ? '点击设置' : birthday}
              </View>
            </Picker>
          </View>
        </View>
        <View
          className={`setting-item`}
        >
          <View
            className={`item-title`}
          >
            期望寿命
          </View>
          <View
            className={`item-action ${classDark}`}
          >
            <Input
              type='number'
              placeholder='默认 77'
              className={`${isFocus ? 'focus' : ''}`}
              value={explife ? explife : avglife}
              onFocus={this.onLifeFocus}
              onInput={this.onLifeInput}
              onBlur={this.onLifeBlur}
             />
          </View>
        </View>
        <View
          className={`setting-item`}
        >
          <View
            className={`item-title`}
          >
            每周的第一天
          </View>
          <View
            className={`item-action ${classDark}`}
          >
            <View
              className={`action-0 ${is(weekStartDay, 0) ? 'current' : ''}`}
              onClick={() => this.setWeekStartDay(0)}
            >
              <View
                className={`action-icon`}
              >
                <MyIcon 
                  name='week-0'
                />
              </View>
              周日
            </View>
            <View
              className={`action-1 ${is(weekStartDay, 1) ? 'current' : ''}`}
              onClick={() => this.setWeekStartDay(1)}
            >
              <View
                className={`action-icon`}
              >
                <MyIcon 
                  name='week-1'
                />
              </View>
              周一
            </View>
          </View>
        </View>
        <View
          className={`setting-item`}
        >
          <View
            className={`item-title`}
          >
            默认视图
          </View>
          <View
            className={`item-action ${classDark}`}
          >
            <View
              className={`action-0 ${isDetail ? '' : 'current'}`}
              onClick={() => this.setViewMode(false)}
            >
              <View
                className={`action-icon`}
              >
                <MyIcon 
                  name='view-0'
                />
              </View>
              简洁
            </View>
            <View
              className={`action-1 ${isDetail ? 'current' : ''}`}
              onClick={() => this.setViewMode(true)}
            >
              <View
                className={`action-icon`}
              >
                <MyIcon 
                  name='view-1'
                />
              </View>
              详细
            </View>
          </View>
        </View>
        <View
          className={`setting-item`}
        >
          <View
            className={`item-title`}
          >
            云同步
          </View>
          <View
            className={`item-action`}
          >
            <MySwitch
              color={primary}
              isDark={isDark}
              isOpen={useCloudSync}
              onSwitch={() => this.setUseCloudSync()}
            />
          </View>
        </View>
        <View
          className={`setting-item`}
        >
          <View
            className={`item-title`}
          >
            统一进度条颜色
          </View>
          <View
            className={`item-action`}
          >
            <MySwitch
              color={primary}
              isDark={isDark}
              isOpen={usePrimary}
              onSwitch={() => this.setUsePrimary()}
            />
          </View>
        </View>
        <View
          className={`setting-item color ${classDark}`}
        >
          {
            colors.map((item, index) => {
              return (
                <View
                  key={item + index}
                  className={`color-item ${is(item, primary) ? 'current' : ''}`}
                  style={`--background: ${item};`}
                  onClick={()=>this.setPrimaryColor(item)}
                ></View>
              )
            })
          }
        </View>
      </View>
    )
  }
}

export default MySettingList as ComponentType
