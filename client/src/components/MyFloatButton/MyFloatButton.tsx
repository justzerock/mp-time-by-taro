// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './MyFloatButton.scss'
import MyIcon from '../MyIcon/MyIcon'

class MyFloatButton extends Component {
  static defaultProps = {
    isDark: false
  }
  state = {
    expand: false
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

  toggleButton() {
    const { expand } = this.state
    this.setState({
      expand: !expand
    })
  }

  render () {
    const { expand } = this.state
    const { isDark, onAdd, onManage } = this.props
    let classExpand = expand ? 'expand' : ''
    let classDark = isDark ? 'dark' : 'light'
    return (
      <View
        className='my-float-button'
      >
        <View
          className={`main-icon-wrap ${classExpand} ${classDark}`}
          onClick={onAdd}
        >
          <MyIcon 
            name='add'
            color='#0BC84D'
            size='20'
          />
        </View>
      </View>
    )
  }
}

export default MyFloatButton as ComponentType
