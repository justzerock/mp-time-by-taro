// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './MyAvatar.scss'

class MyAvatar extends Component {
  static defaultProps = {
    src: 'https://7a65-zero-to-4649b4-1257642207.tcb.qcloud.la/avatar.png?sign=3965ef6769855635328b28c368a979c0&t=1581784345',
    size: 56
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

  render () {
    const { src, size } = this.props
    let styleAvatar = {
      width: size + 'PX',
      height: size + 'PX'
    }
    let styleImg = {
      width: size + 'PX',
      height: size + 'PX'
    }
    return (
      <View
        className='my-avatar'
        >
        <Image 
          src={src}
          style={styleImg}
        />
      </View>
    )
  }
}

export default MyAvatar as ComponentType
