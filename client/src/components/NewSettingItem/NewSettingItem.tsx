// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Input } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'
import { is } from 'immutable'

import style from './NewSettingItem.scss'
import MyIcon from '../MyIcon/MyIcon'

const cx = classNames.bind(style)

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    isDetail: boolean,
    primary: string,
    colors: Array<string>,
    weekStartDay: number,
    systemInfo: object,
    birthday: string,
    avglife: number,
    explife: number,
    toggleDarkMode: Function,
    setDarkMode: Function,
    setPrimaryColor: Function,
    setExpLife: Function,
    setBirthDay: Function,
    setUpdateData: Function,
    setWeekStartDay: Function,
    setViewMode: Function
  },
  title: string,
  desc: string,
  type: string
}

interface NewSettingItem {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class NewSettingItem extends Component {
  static defaultProps = {
    title: '主题风格',
    type: 'theme',
    position: 'lt',
    itemID: 1,
    current: 0,
    expandState: 'default'
  }

  state = {
    expand: false,
    colorSel: this.props.themeStore.primary,
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

  componentDidMount () { }
  
  componentWillUnmount () { }
  
  componentDidShow () { }
  
  componentDidHide () { }

  componentWillReact () {
  }

  // 当打开选项
  onItemOpen() {
    const { expand } = this.state
    if (expand) return
    this.setState({
      expand: true
    })
    this.props.onExpand(true)
  }

  // 当关闭选项
  onItemClose() {
    this.setState({
      expand: false
    })
    this.props.onExpand(false)
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
    if (life > 150) {
      life = 150
    }
    return life
  }

  // 设置寿命失焦时
  onLifeBlur(e) {
    const { themeStore } = this.props
    let life = e.detail.value
    life = life > 150 ? 150 : life < 50 ? 50 : life
    themeStore.setExpLife(Number(life), false)
    themeStore.setUpdateData()
    this.setState({
      isFocus: false
    })
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

  render () {
    const { themeStore: {isDark, isDetail, colors, primary, birthday, explife, avglife, weekStartDay}, title, type, position, itemID, current, expandState } = this.props
    const { expand, isFocus } = this.state
    const classItem = cx({
      'setting-item': true,
      'light': !isDark,
      'dark': isDark,
      'expand': expand,
      'default': !expand && is(expandState, 'default'),
      'none': !expand && is(expandState, 'expand'),
      'lt': is(position, 'lt'),
      'rt': is(position, 'rt'),
      'lb': is(position, 'lb'),
      'rb': is(position, 'rb'),
    })
    const classOpenLayer = cx({
      'open-layer': true,
      'expand': expand,
    })
    const classBack = cx({
      'btn-back': true, 
      'expand': expand,
      'light': !isDark,
      'dark': isDark,
    })
    const classTypeIcon = cx({
      'type-icon': true,
      'expand': expand 
    })
    const classTypeTitle = cx({
      'type-title': true,
      'expand': expand
    })
    const classAction = cx({
      'action': true,
      'expand': expand
    })

    const classColorGroup = cx({
      'color-group': true,
    })
    const classColorBG = cx({
      'color-bg': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classColorItem = cx({
      'color-item': true,
      'light': !isDark,
      'dark': isDark,
    })
    
    const classLife = cx({
      'life': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classWeek =cx({
      'week': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classSunday = cx({
      'week-item': true,
      'light': !isDark,
      'dark': isDark,
      'current': !weekStartDay
    })
    const classMonday = cx({
      'week-item': true,
      'light': !isDark,
      'dark': isDark,
      'current': weekStartDay
    })
    const classView =cx({
      'view': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classIconProgress = cx({
      'view-icon': true,
      'light': !isDark,
      'dark': isDark,
      'default': isDetail
    })
    const classIconDetail = cx({
      'view-icon': true,
      'light': !isDark,
      'dark': isDark,
      'default': !isDetail
    })
    const classSwicth = cx({
      'switch': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classSwitchBtn = cx({
      'btn': true,
      'light': !isDark,
      'dark': isDark,
      'left': !isDetail,
      'right': isDetail
    })
    const classTitleProgress = cx({
      'title': true,
      'right': true,
      'default': isDetail
    })
    const classTitleDetail = cx({
      'title': true,
      'left': true,
      'default': !isDetail
    })
    
    return (
      <View
        className={classItem}
        >
        <View 
          className={classOpenLayer}
          onClick={this.onItemOpen}
        />
        <View
          className={classBack}
          onClick={this.onItemClose}
        >
          <MyIcon 
            name='back'
          />
        </View>
        <View
          className={classTypeIcon}
        >
          <MyIcon 
            name={is(type, 'week') ?  'week-' + weekStartDay : is(type, 'view') ? 'view-' + Number(isDetail) : type}
          />
        </View>
        <View
          className={classTypeTitle}
        >
          {title}
        </View>
        <View
          className={classAction}
        >
        {
          is(type, 'theme') ?
          <View
            className='primary'
          >
            <View
              className={classColorGroup}
            >
            {
              colors.map((color, index) => {
                return (
                  <View 
                    key={index+color}
                    className={`${classColorBG} ${is(primary, color) ? 'current' : ''}`}
                    style={{background: is(primary, color) ? hexToRgba(color, 0.1) : hexToRgba(color, 0)}}
                    onClick={()=>this.setPrimaryColor(color)}
                  >
                    <View 
                      className={`${classColorItem} ${is(primary, color) ? 'current' : ''}`}
                      style={{ background: `linear-gradient(145deg, ${hexToRgba(color, 0.66)}, ${hexToRgba(color, 0.99)})` }}
                    />
                  </View>
                )
              })
            }
            </View>
          </View> :
          is(type, 'life') ?
          <View
            className={classLife}
          >
            <View
              className='birthday'
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
                  生日：{birthday}
                </View>
              </Picker>
              <View
                className='birth-text'
              >
                <View
                  className='birth-name'
                >
                  生日:
                </View>
                {is(birthday, '')  ? '点击设置' : birthday}
              </View>
              <View
                className='range'
              >
                生日范围：<View className='number'>1900 </View> - 至今
              </View>
            </View>
            <View
              className='age'
            >
              <Input
                type='number'
                placeholder='默认 77'
                style={{opacity: isFocus ? 1 : 0}}
                value={explife ? explife : avglife}
                onFocus={this.onLifeFocus}
                onInput={this.onLifeInput}
                onBlur={this.onLifeBlur}
              />
              <View
                className='age-text'
                style={{opacity: isFocus ? 0 : 1}}
              >
                <View
                  className='age-name'
                >
                  期望寿命：
                </View>
                {explife ? explife : avglife}
              </View>
              <View
                className='range'
              >
                寿命范围：<View className='number'>50 - 150</View>
              </View>
            </View>
          </View> :
          is(type, 'week') ?
          <View
            className={classWeek}
          >
            <View
              className={classSunday}
              onClick={() => this.setWeekStartDay(0)}
              >
              周日
            </View>
            <View
              className={classMonday}
              onClick={() => this.setWeekStartDay(1)}
            >
              周一
            </View>
          </View> :
          <View
            className={classView}
          >
            <View
              className={classIconProgress}
            >
              <MyIcon 
                name='view-0'
              />
            </View>
            <View 
              className={classSwicth}
              onClick={() => this.setViewMode(!isDetail)}
            >
              <View 
                className={classSwitchBtn} 
              />
              <View 
                className={classTitleProgress}
              >
                简洁
              </View>
              <View 
                className={classTitleDetail}
              >
                详细
              </View>
            </View>
            <View
              className={classIconDetail}
            >
              <MyIcon 
                name='view-1'
              />
            </View>
          </View>
        }
        </View>
      </View>
    )
  }
}

export default NewSettingItem as ComponentType
