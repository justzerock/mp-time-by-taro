// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './MyFirstTip.scss'

class MyFirstTip extends Component {
  static defaultProps = {
    hasHomeBar: false,
    isShow: false,
    isDark: false,
    content: '怎么操作呢',
    isTop: true
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
    const { hasHomeBar, isShow, isDark, content, isTop } = this.props
    const styleInfo = `
      --bottom: ${hasHomeBar ? '110PX' : 'calc(4vw + 66PX)'};
      --transform: ${isShow ? 'scale(1)' : 'scale(0)'};
      --background: ${isDark ? '#414141' : '#F4F5FB'};
      --top: ${hasHomeBar ? '25vh' : '20vh'}
    `
    return (
      <View
        className={`my-tip ${isTop ? 'top' : 'bottom'}`}
        style={styleInfo}
      >
        <Text
          className={`tip-text`}
        >
          {content}
        </Text>
      </View>
    )
  }
}

export default MyFirstTip as ComponentType
