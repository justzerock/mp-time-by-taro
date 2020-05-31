// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import styles from './MyProgressColor.scss'
import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'
import { is } from 'immutable'

const cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    colors: Array<string>,
    list: Array<object>,
    setListData: Function,
    setUsePrimary: Function
    isDark: boolean,
  },
  show: boolean,
  curColor: string,
  type: string,
  onSetBarColor: Function
}
interface MyProgressColor {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MyProgressColor extends Component {
  static defaultProps = {
    isDark: false,
    show: false,
    curColor: '009BEC',
    type: 'year',
   }

  state = { }

  componentWillMount () {}

  componentDidMount () { }
  
  componentWillUnmount () { }
  
  componentDidShow () { }
  
  componentDidHide () { }

  componentWillReact () {
  }

  setBarColor = (color) => {
    const { themeStore, type } = this.props
    const newList = themeStore.list
    const index = newList.findIndex(item => item.type === type)
    newList[index].color = color
    themeStore.setListData(newList, false)
    themeStore.setUsePrimary(false, false)
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
    const { themeStore: { colors, isDark }, show, curColor } = this.props
    const classColorSet = cx({
      'color-set': true,
      'light': !isDark,
      'dark': isDark,
      'show': show,
      'hide': !show,
    })
    const classItemBG = cx({
      'item-bg': true,
      'light': !isDark,
      'dark': isDark
    })
    const classColorItem = cx({
      'color-item': true
    })
    return (
      <View
        className={classColorSet}
      > 
        {
          colors.map((color, index) => {
            return (
              <View 
                key={index+color}
                className={`${classItemBG} ${is(curColor, color) ? 'current' : ''}`}
                style={`--primary-rgb: ${is(curColor, color) ? this.hexToRgb(color) : ''}`}
                /* style={{background: is(curColor, color) ? hexToRgba(color, 0.05) : hexToRgba(color, 0)}} */
                onClick={()=>this.setBarColor(color)}
              >
                <View 
                  className={`${classColorItem}`}
                  style={{ background: `linear-gradient(145deg, ${hexToRgba(color, 0.66)}, ${hexToRgba(color, 0.99)})` }}
                />
              </View>
            )
          })
        }
      </View>
    )
  }
}

export default MyProgressColor as ComponentType
