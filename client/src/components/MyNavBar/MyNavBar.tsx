// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import classNames from 'classnames/bind'

import styles from './MyNavBar.scss'
import MySwitcher from '../MySwitcher/MySwitcher'

let cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    isRight: boolean,
    navBarTitle: string,
    systemInfo: object,
    menuButton: object,
    navInfo: object
  }
}

interface MyNavBar {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MyNavBar extends Component {

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

  render () {
    const { themeStore: { isDark, isRight, navBarTitle, systemInfo, menuButton, navInfo } } = this.props
    let classNavBar = cx({
      'my-nav-bar': true,
      'light': !isDark,
      'dark': isDark
    })
    let classTitle = cx({
      'my-title': true
    })
    let classIndicator = cx({
      'Indicator': true
    })
    let classIndicatorOne = cx({
      'one': true,
      'light': !isDark,
      'dark': isDark,
      'cur': !isRight
    })
    let classIndicatorTwo = cx({
      'two': true,
      'light': !isDark,
      'dark': isDark,
      'cur': isRight
    })

    let classCapsule = cx({
      'capsule': true,
      'light': !isDark,
      'dark': isDark
    })
    
    let styleNavBar = {
      paddingTop: navInfo.navTop,
      height: navInfo.navHeight
    }
    let styleCapsule = {
      width: navInfo.menuWidth,
      height: navInfo.menuHeight,
      borderRadius: navInfo.menuHeight,
      left: navInfo.menuLeft,
      top: navInfo.menuTop
    }
    return (
      <View 
        className={classNavBar}
        style={styleNavBar}
      >
        {/* <View
          className={classIndicator}
        >
          <View
            className={classIndicatorOne}
          ></View>
          <View
            className={classIndicatorTwo}
          ></View>
        </View> */}
        <View>
          <MySwitcher />
        </View>
        <Text 
          className={classTitle} 
        >
          {navBarTitle}
        </Text>
        <View
          className={classCapsule}
          style={styleCapsule}
        ></View>
      </View>
    )
  }
}

export default MyNavBar  as ComponentType
