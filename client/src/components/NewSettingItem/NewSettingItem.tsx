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
import MySwitcher from '../MySwitcher/MySwitcher'

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
    iTouch: false,
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

  // 当触摸设置选项
  onItemTouch(e) {
    const type = e.type
    switch(type) {
      case 'touchstart':
        this.setState({
          iTouch: true
        })
        break
      case 'touchend':
        this.setState({
          iTouch: false
        })
        break
    }
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
      themeStore.setPrimaryColor(color)
    }
  } 

  // 设置出生年月
  onDateChange(e) {
    const { themeStore } = this.props
    const today = new Date().toLocaleDateString('zh')
    let birthday = e.detail.value.replace(/-/g, '/')
    birthday = birthday > today ? today : birthday 
    themeStore.setBirthDay(birthday)
    themeStore.setUpdateData(0, true)
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
    themeStore.setExpLife(Number(life))
    themeStore.setUpdateData(0, true)
    this.setState({
      isFocus: false
    })
  }

  render () {
    const { themeStore: {isDark, colors, primary, birthday, explife, avglife}, title, type, position, itemID, current, expandState } = this.props
    const { iTouch, expand, isFocus } = this.state
    const classItem = cx({
      'setting-item': true,
      'light': !isDark,
      'dark': isDark,
      'touch': iTouch,
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
    return (
      <View
        className={classItem}
        onTouchStart={this.onItemTouch}
        onTouchEnd={this.onItemTouch}
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
            name={type}
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
            {/* <View
              className='color-hex'
            >
              主题色
            </View> */}
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
                start='1900/01/01'
                value={ is(birthday, '') ? new Date().toLocaleDateString('zh') : birthday}
                end={new Date().toLocaleDateString('zh')}
                onChange={this.onDateChange}
                className='birth-day'
              >
                <View className='picker'>
                  {is(birthday, '')  ? '点击设置' : birthday}
                </View>
              </Picker>
              <View
                className='birth-text'
              >
                <View
                  className='birth-name'
                >
                  生日:{is(birthday, '')  ? '点击设置' : ''}
                </View>
                {birthday}
              </View>
              <View
                className='range'
              >
                生日范围：1900至今
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
                寿命范围：50-150
              </View>
            </View>
          </View> :
          is(type, 'week') ?
          <View
            className={classWeek}
          >
            
          </View> :
          is(type, 'view') ?
          <View></View> :
          <View></View>
        }
        </View>
      </View>
    )
  }
}

export default NewSettingItem as ComponentType
