// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './MyIcon.scss'
import '../../assets/iconfont.css'

class MyIcon extends Component {
  static defaultProps = {
    name: 'smile',
    size: 48,
    color: '#7789A1'
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

    const { name, size, color } = this.props

    let iconName = 'icon-' + name

    let styleIcon = {
      /* fontSize: size + 'PX',
      color: color */
    }

    return (
      <View
        className={`icon ${iconName}`}
        style={styleIcon}
      >
      </View>
    )
  }
}

export default MyIcon as ComponentType
