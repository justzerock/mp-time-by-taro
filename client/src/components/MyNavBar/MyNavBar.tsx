// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import classNames from 'classnames/bind'

import MySwitch from '../MySwitch/MySwitch'

import styles from './MyNavBar.scss'

let cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    setStatusBarHeight: Function,
    setDarkMode: Function,
    toggleDarkMode: Function,
    isDark: boolean,
    statusBarHeight: number, 
    navBarTitle: string
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

  componentWillMount () { 
    Taro.getStorage({key: 'statusBarHeight'})
    .then(
      res => this.setStatusBarHeight(res.data, false)
    )
    .catch(
      () => Taro.getSystemInfo()
      .then(
        res => this.setStatusBarHeight(res.statusBarHeight, true)
      )
    )
  }

  componentDidMount () { }
  
  componentWillUnmount () { }
  
  componentDidShow () { }
  
  componentDidHide () { }

  componentWillReact () { }

  setStatusBarHeight = (height, isFirst) => {
    const { themeStore } = this.props
    themeStore.setStatusBarHeight(height, isFirst)
  }

  toggleDarkMode = () => {
    const { themeStore } = this.props
    themeStore.toggleDarkMode()
  }


  render () {
    const { themeStore: { isDark, statusBarHeight, navBarTitle } } = this.props
    let classNavBar = cx({
      'my-nav-bar': true
    })
    let classTitle = cx({
      'my-title': true
    })
    
    let styleNavBar = {
      paddingTop: statusBarHeight + 'PX'
    }
    return (
      <View 
        className={classNavBar}
        style={styleNavBar}
      >
        <MySwitch
          onToggle={this.toggleDarkMode}
          isDark={isDark}
        />
        <Text 
          className={classTitle} 
        >
          {navBarTitle}
        </Text>
      </View>
    )
  }
}

export default MyNavBar  as ComponentType
