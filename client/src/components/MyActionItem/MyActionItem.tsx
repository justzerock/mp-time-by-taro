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
    edit: false,
    dateSel: '1993-1-1',
    life: 77,
  }

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
