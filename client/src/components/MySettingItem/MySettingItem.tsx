// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Icon, Picker } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import hexToRgba from 'hex-to-rgba'

import './MySettingItem.scss'
import MyIcon from '../MyIcon/MyIcon'

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    primary: string,
    wStart: number,
    systemInfo: object,
    birthday: string,
    avglife: number,
    explife: number,
    toggleDarkMode: Function,
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
    touch: false
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

  toggleDarkMode = () => {
    const { themeStore } = this.props
    themeStore.toggleDarkMode()
  }

  onTouch(e) {
    let type = e.type
    switch(type) {
      case 'touchstart':
        this.setState({
          touch: true
        })
        break
      case 'touchend':
        this.setState({
          touch: false
        })
        break
    }
  }

  render () {
    const { themeStore: {isDark, primary, wStart, birthday}, title, desc, type } = this.props
    const { touch } = this.state
    let classDark = isDark ? 'dark' : 'light'
    let classTouch = touch ? 'touch' : ''
    let getIconName = () => {
      let iconName = type
      if (type === 'week') {
        iconName = 'week-' + wStart
      }
      return iconName
    }

    let styleSwitch = {
      background: hexToRgba(primary, 0.6)
    }
    return (
      <View 
        className={`setting-item ${classTouch} ${classDark}`}
        onTouchStart={this.onTouch}
        onTouchEnd={this.onTouch}
      >
        <View className='item-title'>
          <View className='item-icon'>
            <MyIcon 
              name={getIconName()}
              size='40'
              color={hexToRgba(primary, 0.6)}
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
              className={`text-desc ${classDark}`}
            >
              {desc}
            </View>
          </View>
        </View>
        <View className='item-content'>
          {
            type === 'mode' ?
              <View
                className={`item-switch ${classDark}`}
                style={isDark ? styleSwitch : ''}
                onClick={this.toggleDarkMode}
              >
                <View 
                  className={`switch ${classDark}`}
                >
                  <MyIcon 
                    name={isDark ? 'moon' : 'sun'}
                    size='18'
                    color={isDark ? hexToRgba('#DDE1E7', 0.8) : hexToRgba('#FFBD6D', 0.6)}
                  />
                </View>
              </View> : 
            type === 'birth' ?
              <View className='item-birth'>
                <Picker
                  mode='date'
                  className='birth-day'
                >
                  <View className='picker'>
                    {birthday===''? '点击设置':birthday}
                  </View>
                </Picker>
              </View> :
            type === 'week' ? 
              <View
                className='item-content'
              >
                {
                  wStart ? '周一' : '周日'
                }
              </View> :
            type === 'view' ?
              <View>进度条</View> :
              <View>条形</View>
          }
        </View>
      </View>
    )
  }
}

export default MySettingItem as ComponentType
