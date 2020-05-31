// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
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
  }

  componentWillMount () {}

  componentDidMount () { }
  
  componentWillUnmount () { }
  
  componentDidShow () { }
  
  componentDidHide () { }

  componentWillReact () {
  }

  // 添加移除进度条
  toggleItem = () => {
    const {type, selected} = this.props
    this.props.onToggleItem(type, selected)
  }
  
  render () {
    const { isDark, name, percent, color, selected, type, onEditItem, onToggleItem, onColorSet } = this.props

    const classDark = isDark ? 'dark' : 'light'
    const styleColor = {
      background: color
    }
    return (
      <View
        className={`my-action-item ${classDark}`}
        onClick={() => onToggleItem(type, selected)}
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
