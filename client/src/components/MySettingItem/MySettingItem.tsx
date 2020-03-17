// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Input } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'
import { is } from 'immutable'

import styles from './MySettingItem.scss'
import MyIcon from '../MyIcon/MyIcon'
import MySwitcher from '../MySwitcher/MySwitcher'

const cx = classNames.bind(styles)

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

interface MySettingItem {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MySettingItem extends Component {
  static defaultProps = {
    title: '设置标题',
    desc: '描述内容',
    type: 'theme'
  }
  state = {
    iTouch: false,
    aTouch: false,
    cTouch: false,
    colorIndex: '',
    wTouch: false,
    weekIndex: '',
    transAction: false,
    transX: '0'
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

  shouldComponentUpdate(nextProps, nextState) {
    const thisState = this.state || {}
    for (const key in nextState) {
      if (nextState.hasOwnProperty(key) &&
        !is(thisState[key], nextState[key])) {
        return true;
      }
    }
    return false
  }

  componentDidUpdate () {
    console.log('updated')
  }

  // 切换亮暗模式
  toggleDarkMode = () => {
    const { themeStore } = this.props
    themeStore.toggleDarkMode()
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

  // 当触摸主题设置按钮时
  onActionTouch(e) {
    const type = e.type
    switch(type) {
      case 'touchstart':
        this.setState({
          aTouch: true
        })
        break
      case 'touchend':
        this.setState({
          aTouch: false
        })
        break
    }
  }

  // 当触摸颜色按钮时
  onColorTouch(e, index) {
    const type = e.type
    switch(type) {
      case 'touchstart':
        this.setState({
          cTouch: true,
          colorIndex: index
        })
        break
      case 'touchend':
        this.setState({
          cTouch: false,
          colorIndex: ''
        })
        break
    }
  }
  
  // 当触摸周按钮时
  onWeekTouch(e, index) {
    const type = e.type
    switch(type) {
      case 'touchstart':
        this.setState({
          wTouch: true,
          weekIndex: index
        })
        break
      case 'touchend':
        this.setState({
          wTouch: false,
          weekIndex: ''
        })
        break
    }
  }
  // 设置主题色
  setPrimaryColor(color) {
    const { themeStore } = this.props
    themeStore.setPrimaryColor(color)
  }

  // 切换主题设置按钮
  toggleAction() {
    const { transAction } = this.state
    this.setState({
      transX: transAction ? '0' : '-67.5vw',
      transAction: transAction ? false : true
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
  
  // 修改每周起始日，默认周日
  onWeekChange(day) {
    const { themeStore } = this.props
    themeStore.setWeekStartDay(day)
    themeStore.setUpdateData(0, true)
  }
  
  // 修改默认视图
  onViewChange(isDetail) {
    const { themeStore } = this.props
    themeStore.setViewMode(isDetail)
  }

  render () {
    const { themeStore: { isDark, isDetail, primary, colors, weekStartDay, birthday, explife, avglife}, title, desc, type } = this.props
    const { iTouch, aTouch, cTouch, colorIndex, wTouch, weekIndex, transX, transAction } = this.state
    const classSettingItem = cx({
      'setting-item': true,
      'light': !isDark,
      'dark': isDark,
      'touch': iTouch
    })
    const classTextDesc = cx({
      'text-desc': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classItemSwitch = cx({
      'item-switch': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classSwitch = cx({
      'switch': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classThemeBtn = cx({
      'theme-btn': true,
      'light': !isDark,
      'dark': isDark,
      'touch': aTouch
    })
    const classColors = cx({
      'colors': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classWeekGroup = cx({
      'week-group': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classViewGroup = cx({
      'view-group': true,
      'light': !isDark,
      'dark': isDark,
    })

    const getIconName = () => {
      let iconName = type
      if (type === 'week') {
        iconName = 'week-' + weekStartDay
      }
      return iconName
    }
    const getColorBG = (color) => {
      return {background: hexToRgba(color, 0.8)}
    }
    const getColorTouch = (index) => {
      return cTouch && colorIndex === index ? 'touch' : ''
    }
    const getWeekTouch = (index) => {
      return wTouch && weekIndex === index ? 'touch' : ''
    }

    const styleSwitch = {
      background: hexToRgba(primary, 0.8)
    }
    const styleTitle = {
      transform: `translateX(${transX})`
    }
    const styleAction = {
      transform: `translateX(${transX})`
    }
    return (
      <View 
        className={classSettingItem}
        onTouchStart={this.onItemTouch}
        onTouchEnd={this.onItemTouch}
      >
        <View
          className='item-title'
          style={styleTitle}
        >
          <View className='item-icon'>
            <MyIcon 
              name={getIconName()}
              size='40'
              color={hexToRgba(primary, 0.8)}
            />
          </View>
          <View
            className='item-text'
          >
            <View
              className='text-title'
            >
              {title}
            </View>
            <View
              className={classTextDesc}
            >
              {desc}
            </View>
          </View>
        </View>
        <View
          className='item-content'
          style={styleAction}
        >
          {
            type === 'mode' ?
              <MySwitcher /> : 
            type === 'theme' ?
             <View
              className={`item-theme`}
              >
               <View
                className={classThemeBtn}
                onTouchStart={this.onActionTouch}
                onTouchEnd={this.onActionTouch}
                onClick={this.toggleAction}
               >
                <MyIcon 
                  name={transAction ? 'back' : 'color'}
                  size='20'
                  color={hexToRgba(primary, 0.8)}
                />
               </View>
               <View
                className={classColors}
               >
                 {
                   colors.map((item, index) => {
                     return (
                       <View 
                        key={index+item}
                        className={`color-item ${getColorTouch(index+item)}`}
                        style={getColorBG(item)}
                        onTouchStart={e=> this.onColorTouch(e, index+item)}
                        onTouchEnd={e=> this.onColorTouch(e, index+item)}
                        onClick={()=>this.setPrimaryColor(item)}
                       />
                     )
                   })
                 }
               </View>
             </View> :
            type === 'birth' ?
              <View className='item-birth'>
                <Picker
                  mode='date'
                  start='1900/01/01'
                  value={birthday === '' ? new Date().toLocaleDateString('zh') : birthday}
                  end={new Date().toLocaleDateString('zh')}
                  onChange={this.onDateChange}
                  className='birth-day'
                >
                  <View className='picker'>
                    {birthday==='' ? '点击设置' : birthday}
                  </View>
                </Picker>
              </View> :
            type === 'life' ? 
              <View className='item-life'>
                <Input
                  type='number'
                  placeholder='默认 77'
                  value={explife ? explife : avglife}
                  onInput={this.onLifeInput}
                  onBlur={this.onLifeBlur}
                />
              </View> :
            type === 'week' ? 
              <View
                className={classWeekGroup}
              >
                <View 
                  className={`week-label ${weekStartDay ? '' : 'active'} ${getWeekTouch('w0')}`}
                  onClick={()=> this.onWeekChange(0)}
                  onTouchStart={e=>this.onWeekTouch(e, 'w0')}
                  onTouchEnd={e=>this.onWeekTouch(e, 'w0')}
                  >
                  周日
                </View>
                <View 
                  className={`week-label ${weekStartDay ? 'active' : ''} ${getWeekTouch('w1')}`}
                  onClick={()=> this.onWeekChange(1)}
                  onTouchStart={e=>this.onWeekTouch(e, 'w1')}
                  onTouchEnd={e=>this.onWeekTouch(e, 'w1')}
                >
                  周一
                </View>
              </View> :
              <View
                className={classViewGroup}
              >
                <View 
                  className={`view-label ${isDetail ? '' : 'active'} ${getWeekTouch('v0')}`}
                  onClick={()=> this.onViewChange(false)}
                  onTouchStart={e=>this.onWeekTouch(e, 'v0')}
                  onTouchEnd={e=>this.onWeekTouch(e, 'v0')}
                  >
                  进度
                </View>
                <View 
                  className={`view-label ${isDetail ? 'active' : ''} ${getWeekTouch('v1')}`}
                  onClick={()=> this.onViewChange(true)}
                  onTouchStart={e=>this.onWeekTouch(e, 'v1')}
                  onTouchEnd={e=>this.onWeekTouch(e, 'v1')}
                >
                  详情
                </View>
              </View>
          }
        </View>
      </View>
    )
  }
}

export default MySettingItem as ComponentType
