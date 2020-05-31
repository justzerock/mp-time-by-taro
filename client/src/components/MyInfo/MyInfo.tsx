// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import MyIcon from '../../components/MyIcon/MyIcon'
import './MyInfo.scss'

class MyInfo extends Component {
  static defaultProps = {
    hasHomeBar: false,
    isShow: false,
    isDark: false,
    primary: '#7789A1'
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

  // 转换颜色值
  hexToRgb = (hex)=> {
    hex = hex.slice(1)
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
  }

  render () {
    const { hasHomeBar, isShow, isDark, onHideInfo, primary } = this.props
    const styleInfo = `
      --bottom: ${hasHomeBar ? '110PX' : 'calc(4vw + 66PX)'};
      --transform: ${isShow ? 'scale(1)' : 'scale(0)'};
      --background: ${isDark ? '#414141' : '#F4F5FB'};
      --primary-color: ${this.hexToRgb(primary)}
    `
    const styleInfoIcon = `
      --color: ${primary}
    `
    return (
      <View
        className={`my-info`}
        style={styleInfo}
      >
        <View
          className={`info-title`}
        >
          操作提示
        </View>
        <Text
          className={`info-text`}
        >
          点击进度条切换视图\n点击图标设置颜色\n
        </Text>
        <View>
          点击按钮
          <View
            className={`info-icon`}
            style={styleInfoIcon}
          >
            <MyIcon 
              name='manage'
            />
          </View> 
          管理进度条
        </View>
        <View>
          点击按钮
          <View
            className={`info-icon`}
            style={styleInfoIcon}
          >
            <MyIcon 
              name='setting'
            />
          </View> 
          设置进度条
        </View>
        <View
          className={`i-know`}
          onClick={onHideInfo}
        >👌 晓得了</View>
      </View>
    )
  }
}

export default MyInfo as ComponentType
