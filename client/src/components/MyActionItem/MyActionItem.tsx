// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Input } from '@tarojs/components'
import './MyActionItem.scss'
import MyCounter from '../MyCounter/MyCounter'

class MyActionItem extends Component {
  static defaultProps = {
    isDark: false,
    name: '年进度',
    percent: 0,
    color: '#009BEC',
    selected: false,
    type: 'year'
  }

  state = {
    edit: false,
    dateSel: '1993-1-1',
    life: 77,
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

  onEditItem = () => {
    const { type } = this.props
    const { edit } = this.state
    if (['week', 'life'].indexOf(type) !== -1) {
      this.setState({
        edit: !edit
      })
    }
  }

  render () {
    const { isDark, name, percent, color, selected, type, onEditItem, onToggleItem } = this.props
    let classDark = isDark ? 'dark' : 'light'
    let styleColor = {
      background: color
    }
    return (
      <View
        className={`my-action-item ${classDark}`}
        onClick={onToggleItem}
      > 
        <View
          className={`color-block ${classDark}`}
          style={styleColor}
        ></View>
        <View
          className='item-name'
        >
          { name }
        </View>
        <View
          className='item-percent'
        >
          <MyCounter
            value={percent}
          />
        </View>
      </View>
    )
  }
}

export default MyActionItem as ComponentType
