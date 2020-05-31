// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import MyIcon from '../../components/MyIcon/MyIcon'
import './MyFirstButton.scss'

class MyFirstButton extends Component {
  static defaultProps = {
    isShow: false,
    isDark: false,
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

  render () {
    const { isShow, isDark, onSetFirst } = this.props
    const styleInfo = `
      --transform: ${isShow ? 'scale(1)' : 'scale(0)'};
      --background: ${isDark ? '#414141' : '#F4F5FB'};
    `
    return (
      <View
        className={`my-button`}
        style={styleInfo}
        onClick={onSetFirst}
      >
        👌 了解
      </View>
    )
  }
}

export default MyFirstButton as ComponentType
