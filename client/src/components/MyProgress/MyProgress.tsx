// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'
import { is } from 'immutable'

import styles from './MyProgress.scss'
import MyIcon from '../MyIcon/MyIcon'
import MyCounter from '../MyCounter/MyCounter'

const cx = classNames.bind(styles)

type PageStateProps = {
  name: string,
  title: string,
  percent: number,
  color: string,
  icon: string,
  time: number,
  width: string,
  barHeight: number,
  isDark: boolean,
  isDetail: boolean,
  weekStartDay: number,
  type: string,
  birthday: string,
  avglife: number,
  explife: number
}

interface MyProgress {
  props: PageStateProps
}

@inject('themeStore')
@observer
class MyProgress extends Component {
  static defaultProps = {
    name: '年进度',
    title: '',
    percent: 50,
    color: '#009BEC',
    icon: 'earth',
    time: 2020,
    width: '84vw',
    barHeight: 60,
    isDark: false,
    isDetail: false,
    weekStartDay: 0,
    type: 'year',
    birthday: '',
    avglife: 77,
    explife: 0
  }
  
  state = {
    counterValue: 0,
    detail: this.props.isDetail,
    life: this.props.explife ? this.props.explife : this.props.avglife,
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentWillMount () {
  }

  componentDidMount () {
    setTimeout(() => {      
      this.setState({
        counterValue: this.props.percent
      })
    }, 1000)
  }

  componentDidUpdate (prevProps) {
    const { percent } = this.props
    if ( percent !== prevProps.percent) {
      this.animatePercent(percent)
    }
  }
  
  componentWillUnmount () { }
  
  componentDidShow () { 
    this.setState({
      counterValue: this.props.percent
    })
  }
  
  componentDidHide () { 
    this.setState({
      counterValue: this.props.percent * .8
    })
  }

  componentWillReact () {}


  animatePercent(percent) {
    this.setState({
      counterValue: percent * .8
    })
    setTimeout(() => {
      this.setState({
        counterValue: percent
      })
    }, 500)
  }

  showDetail = () => {
    const { percent } = this.props
    const { detail } = this.state
    this.setState({
      detail: !detail
    })
    this.animatePercent(percent)
  }

  render () {

    const { name, title, color, width, barHeight, isDark, icon, type, weekStartDay, birthday } = this.props

    const { counterValue, detail } = this.state

    const getShadow = (c1, c2) => {
      return `1PX 1PX 2PX ${c1}, 0 0 0 ${c2}, 1PX 1PX 2PX ${c1}`
    }
    const textShadow = (type) => {
      let shadow
      if (isDark) {
        shadow = '1PX 1PX 2PX rgba(0,0,0,0.2)'
      } else if ( (is(type, 'percent') && counterValue > 50) ) {
        shadow = getShadow(hexToRgba(color, 0.7), '#233541')
      }
      return shadow
    }

    const classProgress = cx({
      'my-progress': true,
      'light': !isDark,
      'dark': isDark,
      'detail': detail
    })
    const classTypeName = cx({
      'type-name': true
    })
    const classDetail = cx({
      'detail': true,
      'light': !isDark,
      'dark': isDark,
    })
    const classDetailIcon = cx({
      'detail-icon': true,
      'light': !isDark,
      'dark': isDark
    })
    const classDetailTitle = cx({
      'detail-title': true
    })
    const classDetailName = cx({
      'detail-name': true
    })
    const classDetailDesc = cx({
      'detail-desc': true
    })
    const classDetailPercent = cx({
      'detail-percent': true
    })
    const classDetailProgress = cx({
      'detail-progress': true,
      'light': !isDark,
      'dark': isDark
    })
    const classDetailProgressPercent = cx({
      'detail-progress-percent': true,
      'light': !isDark,
      'dark': isDark
    })
    const classBarcolor = cx({
      'bar-color': true,
      'light': !isDark,
      'dark': isDark
    })
    const classPercent = cx({
      'percent': true,
      'left': counterValue > 50,
      'right': counterValue <= 50
    })
    const classTopShadow = cx({
      'top-shadow': !detail,
      'light': !isDark,
      'dark': isDark
    })

    const styleProgress = {
      color: color,
      width: width,
      height: detail ? barHeight*2.3 + 'PX' : barHeight + 'PX',
      borderRadius: `${barHeight / 2}PX`,
      margin: '4vw',
    }
    const styleBarcolor = {
      width: detail ? '0' : counterValue + '%',
      borderRadius: `${barHeight / 2}PX`,
      background: hexToRgba(color, 0.7)
    }
    const stylePercent = {
      color: counterValue <= 50 ? hexToRgba(color, 0.6) : hexToRgba('#efefef', 0.9),
      textShadow: textShadow('percent'),
      opacity: detail ? 0 : 1
    }
    const styleTypeName = {
      right: barHeight / 4 + 'PX',
      opacity: detail ? 0 : (100 - counterValue)/100,
      color: hexToRgba(color, 0.6)
    }
    const styleDetail = {
      width: width,
      color: hexToRgba(color, 0.6),
      opacity: detail ? 1 : 0
    }
    const styleDetailProgress = {
      background: hexToRgba(color, 0.1)
    }
    const styleDetailProgressPercent = {
      background: hexToRgba(color, 0.5),
      width: counterValue + '%'
    }

    const styleTopShadow = {
      borderRadius: `${barHeight / 2}PX`,
    }

    return (
      <View
        className={classProgress}
        style={styleProgress}
        onClick={this.showDetail}
      >
        <View
          className={classTypeName}
          style={styleTypeName}
        >
          {type.toUpperCase()}
        </View>
        <View
          className={classDetail}
          style={styleDetail}
        >
          <View
            className={classDetailIcon}
          >
            <MyIcon 
              name={is(icon, 'week') ? 'week-' + weekStartDay : icon }
            />
          </View>
          <View
            className={classDetailTitle}
          >
            <View
              className={classDetailName}
            >
              {name}
            </View>
            <Text
              className={classDetailDesc}
            >
              {
                is(type, 'life') && is(birthday, '') ?
                '未设置出生年月，左滑设置生日' :
                title
              }
            </Text>
          </View>
          {
            is(birthday, '') && is(type, 'life') ?
            <View
              className='set-tip'
            >
              <MyIcon 
                name='swipe-left'
              />
            </View> : ''
          }
          <View
            className={classDetailProgress}
            style={styleDetailProgress}
          >
            <View 
              className={classDetailProgressPercent}
              style={styleDetailProgressPercent}
            >
              <View
                className={classDetailPercent}
              >
                <MyCounter 
                  value={counterValue}
                />
              </View>
            </View>
          </View>
        </View>
        <View 
          className={classBarcolor}
          style={styleBarcolor}
        >
          <View
            className={classPercent}
            style={stylePercent}
          >
            <MyCounter 
              value={counterValue}
            />
          </View>
        </View>
        <View 
          className={classTopShadow}
          style={styleTopShadow}
        />
      </View>
    )
  }
}

export default MyProgress as ComponentType
