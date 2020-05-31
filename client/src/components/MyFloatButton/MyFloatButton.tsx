// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import hexToRgba from 'hex-to-rgba'

import './MyFloatButton.scss'
import MyIcon from '../MyIcon/MyIcon'

class MyFloatButton extends Component {
  static defaultProps = {
    isDark: false,
    primary: '#7789A1'
  }
  state = {
    isOpen: false
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

  onOpenBtn = () => {
    const { isOpen } = this.state
    this.setState({
      isOpen: !isOpen
    })
  }

  render () {
    const { isDark, onManage, onShowInfo, onSettingList, primary } = this.props
    const { isOpen } = this.state
    let classDark = isDark ? 'dark' : 'light'
    let classOpen = isOpen ? 'open' : 'close'
    return (
      <View
        className={`float-btn-group`}
      >
        <View
          className={`main-btn ${classDark} ${classOpen}`}
          style={{color: primary}}
          onClick={this.onOpenBtn}
        >
          <View
            className={`icon-wrap`}
          >
            <MyIcon 
              name='plus'
            />
          </View>
        </View>
        <View
          className={`setting-btn ${classDark} ${classOpen}`}
          onClick={onSettingList}
        >
          <MyIcon 
            name='setting'
          />
        </View>
        <View
          className={`manage-btn ${classDark} ${classOpen}`}
          onClick={onManage}
        >
          <MyIcon
            name='manage'
          />
        </View>
        <View
          className={`info-btn ${classDark} ${classOpen}`}
          onClick={onShowInfo}
        >
          <MyIcon
            name='info'
          />
        </View>
      </View>
    )
  }
}

export default MyFloatButton as ComponentType
