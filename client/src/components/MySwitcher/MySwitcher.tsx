// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'

import styles from './MySwitcher.scss'
import MyIcon from '../MyIcon/MyIcon'

let cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    toggleDarkMode: Function
  }
}

interface MySwitcher {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MySwitcher extends Component {
  static defaultProps = {
    isDark: false,
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentWillMount () { }

  componentDidMount () { }
  
  componentWillUnmount () { }
  
  componentDidShow () { }
  
  componentDidHide () { }

  componentWillReact () { }

  // 切换亮暗模式
  toggleDarkMode = () => {
    const { themeStore } = this.props
    themeStore.toggleDarkMode()
  }

  render () {
    const { themeStore: { isDark } } = this.props
    const sunColor = '#FFBD6D'
    const moonColor = '#DDE1E7'
    const classSwitchBack = cx({
      'switch-back': true,
      'light': !isDark,
      'dark': isDark
    })
    const classSwicth = cx({
      'my-switch': true,
      'light': !isDark,
      'dark': isDark
    })
    const classIcon = cx({
      'my-icon': true,
      'light': !isDark,
      'dark': isDark
    })
    const classIconSun = cx({
      'icon-sun': true,
      'light': !isDark,
      'dark': isDark
    })
    const classIconMoon = cx({
      'icon-moon': true,
      'light': !isDark,
      'dark': isDark
    })
    return (
      <View
        className={classSwitchBack}
      >
        <View
          className={classIconSun}
        >
          <MyIcon 
            name='sun'
            size='20'
            color={hexToRgba(sunColor, 0.6)}
          />
        </View>
        <View 
          className={classSwicth}
          onClick={this.toggleDarkMode}
        >
          <View 
            className={classIcon} 
          >
          </View>
        </View>
        <View
          className={classIconMoon}
        >
          <MyIcon 
            name='moon'
            size='20'
            color={hexToRgba(moonColor, 0.6)}
          />
        </View>
      </View>
    )
  }
}

export default MySwitcher  as ComponentType
