// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames/bind'

import styles from './MySwitch.scss'

let cx = classNames.bind(styles)

class MySwitch extends Component {

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
    const { isDark } = this.props
    let classSwicth = cx({
      'my-switch': true,
      'light': !isDark,
      'dark': isDark
    })
    let classIcon = cx({
      'my-icon': true,
      'light': !isDark,
      'dark': isDark
    })
    return (
      <View 
        className={classSwicth}
        onClick={this.props.onToggle}
      >
        <View 
          className={classIcon} 
        />
      </View>
    )
  }
}

export default MySwitch  as ComponentType
