// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import classNames from 'classnames/bind'

import styles from './MyNavBar.scss'
import MySwitcher from '../MySwitcher/MySwitcher'
import MyIcon from '../MyIcon/MyIcon'

const cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    isRight: boolean,
    isShare: boolean,
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
    const { themeStore: { isDark, isRight, navBarTitle, isShare, navInfo } } = this.props
    const classNavBar = cx({
      'my-nav-bar': true,
      'light': !isDark,
      'dark': isDark
    })
    const classTitle = cx({
      'my-title': true
    })
    /* const classIndicator = cx({
      'Indicator': true
    })
    const classIndicatorOne = cx({
      'one': true,
      'light': !isDark,
      'dark': isDark,
      'cur': !isRight
    })
    const classIndicatorTwo = cx({
      'two': true,
      'light': !isDark,
      'dark': isDark,
      'cur': isRight
    }) */

    const classCapsule = cx({
      'capsule': true,
      'light': !isDark,
      'dark': isDark,
      'share': isShare
    })
    
    const styleNavBar = {
      paddingTop: navInfo.navTop,
      height: navInfo.navHeight
    }
    const styleCapsule = {
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
        >
          <View
            className='more'
          >
            <MyIcon 
              name='more'
            />
          </View>
          <View
            className='close-circle'
          >
            <MyIcon 
              name='close-circle'
            />
          </View>
          <View 
            className='middle-line'
          ></View>
        </View>
      </View>
    )
  }
}

export default MyNavBar  as ComponentType
