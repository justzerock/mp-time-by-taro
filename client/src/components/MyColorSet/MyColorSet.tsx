// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import styles from './MyColorSet.scss'
import MyIcon from '../MyIcon/MyIcon'
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
  },
  isDark: boolean,
  isTop: boolean,
  show: boolean,
  curColor: string,
  type: string,
  arrowPosition: string,
  onSetBarColor: Function
}
interface MyColorSet {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MyColorSet extends Component {
  static defaultProps = {
    isDark: false,
    isTop: false,
    show: false,
    curColor: '009BEC',
    type: 'year',
    arrowPosition: 'left'
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
    const { themeStore, type, onSetBarColor } = this.props
    const newList = themeStore.list
    const index = newList.findIndex(item => item.type === type)
    newList[index].color = color
    themeStore.setListData(newList, false)
    themeStore.setUsePrimary(false, false)
    onSetBarColor()
  }

  render () {
    const { themeStore: { colors }, isDark, isTop, show, curColor, type, arrowPosition } = this.props
    const classColorSet = cx({
      'color-set': true,
      'light': !isDark,
      'dark': isDark,
      'top-arrow': isTop,
      'bottom-arrow': !isTop,
      'show': show,
      'hide': !show,
      'arrow-left': is(arrowPosition, 'left'),
      'arrow-center': is(arrowPosition, 'center'),
      'arrow-right': is(arrowPosition, 'right'),
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
                style={{background: is(curColor, color) ? hexToRgba(color, 0.05) : hexToRgba(color, 0)}}
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

export default MyColorSet as ComponentType
