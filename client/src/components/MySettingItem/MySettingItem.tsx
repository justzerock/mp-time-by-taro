// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Input } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'

import styles from './MySettingItem.scss'
import MyIcon from '../MyIcon/MyIcon'

let cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    primary: string,
    colors: Array<string>,
    wStart: number,
    systemInfo: object,
    birthday: string,
    avglife: number,
    explife: number,
    toggleDarkMode: Function,
    setPrimaryColor: Function,
    setExpLife: Function,
    setBirthDay: Function,
    setUpdateData: Function
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

  // 切换亮暗模式
  toggleDarkMode = () => {
    const { themeStore } = this.props
    themeStore.toggleDarkMode()
  }

  // 当触摸设置选项
  onItemTouch(e) {
    let type = e.type
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
    let type = e.type
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
    let type = e.type
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
    let today = new Date().toLocaleDateString('zh')
    let birthday = e.detail.value.replace(/-/g, '/')
    birthday = birthday > today ? today : birthday 
    themeStore.setBirthDay(birthday)
    themeStore.setUpdateData(0, true)
  }

  render () {
    const { themeStore: { isDark, primary, colors, wStart, birthday, explife, avglife}, title, desc, type } = this.props
    const { iTouch, aTouch, cTouch, colorIndex, transX, transAction } = this.state
    let classSettingItem = cx({
      'setting-item': true,
      'light': !isDark,
      'dark': isDark,
      'touch': iTouch
    })
    let classTextDesc = cx({
      'text-desc': true,
      'light': !isDark,
      'dark': isDark,
    })
    let classItemSwitch = cx({
      'item-switch': true,
      'light': !isDark,
      'dark': isDark,
    })
    let classSwitch = cx({
      'switch': true,
      'light': !isDark,
      'dark': isDark,
    })
    let classThemeBtn = cx({
      'theme-btn': true,
      'light': !isDark,
      'dark': isDark,
      'touch': aTouch
    })
    let classColors = cx({
      'colors': true,
      'light': !isDark,
      'dark': isDark,
    })

    let getIconName = () => {
      let iconName = type
      if (type === 'week') {
        iconName = 'week-' + wStart
      }
      return iconName
    }
    let getColorBG = (color) => {
      return {background: hexToRgba(color, 0.8)}
    }
    let getColorTouch = (index) => {
      return cTouch && colorIndex === index ? 'touch' : ''
    }

    let styleSwitch = {
      background: hexToRgba(primary, 0.8)
    }
    let styleTitle = {
      transform: `translateX(${transX})`
    }
    let styleAction = {
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
              <View
                className={classItemSwitch}
                style={isDark ? styleSwitch : ''}
                onClick={this.toggleDarkMode}
              >
                <View 
                  className={classSwitch}
                >
                  <MyIcon 
                    name={isDark ? 'moon' : 'sun'}
                    size='18'
                    color={isDark ? hexToRgba('#DDE1E7', 0.8) : hexToRgba('#FFBD6D', 0.8)}
                  />
                </View>
              </View> : 
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
                className='item-content'
              >
                {
                  wStart ? '周一' : '周日'
                }
              </View> :
              <View>进度条</View>
          }
        </View>
      </View>
    )
  }
}

export default MySettingItem as ComponentType
