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
import MyProgressColor from '../MyProgressColor/MyProgressColor'

const cx = classNames.bind(styles)

type PageStateProps = {
  name: string,
  title: string,
  percent: number,
  color: string,
  icon: string,
  time: number,
  width: string,
  barHeight: string,
  isDark: boolean,
  isDetail: boolean,
  weekStartDay: number,
  type: string,
  birthday: string,
  avglife: number,
  explife: number,
  primary: string,
  usePrimary: boolean,
  windowWidth: number,
  windowHeight: number,
  onCloseListFullLayer: Function,
  onShowListFullLayer: Function
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
    width: '90vw',
    barHeight: '18vw',
    isDark: false,
    isDetail: false,
    weekStartDay: 0,
    type: 'year',
    birthday: '',
    avglife: 77,
    explife: 0,
    primary: '#7789A1',
    usePrimary: false,
    windowWidth: 375,
    windowHeight: 667,
  }
  
  state = {
    counterValue: 0,
    detail: this.props.isDetail,
    life: this.props.explife ? this.props.explife : this.props.avglife,
    isTop: true,
    arrowPosition: 'left',
    showColorSet: false
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

  // 切换详情
  showDetail = () => {
    const { percent, onCloseListFullLayer } = this.props
    const { detail, showColorSet } = this.state
    if (showColorSet) {
      this.setState({
        showColorSet: false
      })
      onCloseListFullLayer()
      return
    } else {
      this.setState({
        detail: !detail
      })
      this.animatePercent(percent)
    }
  }

  // 显示颜色设置
  onShowColorSet = (e) => {
    const { windowWidth, windowHeight, onShowListFullLayer } = this.props
    const { showColorSet } = this.state
    const { currentTarget: {x, y, offsetLeft} } = e
    if (showColorSet ) return
    // 进度条宽度90vw
    const percent = (x - offsetLeft) / (windowWidth * 0.84)
    const arrowPosition = percent <= 0.33 ? 'left' : percent <= 0.67 ? 'center' : 'right'
    const isTop = y > windowHeight / 2 ? false : true
    this.setState({
      isTop: isTop,
      showColorSet: true,
      arrowPosition: arrowPosition
    })
    onShowListFullLayer()
  }

  onToggleColorSet = () => {
    const { showColorSet } = this.state
    this.setState({
      showColorSet: !showColorSet,
    })
  }

  // 颜色设置
  onSetBarColor = () => {
    const { onCloseListFullLayer } = this.props
    onCloseListFullLayer()
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

    const { name, title, color, primary, usePrimary, width, barHeight, isDark, icon, type, weekStartDay, birthday } = this.props

    const { counterValue, detail, showColorSet} = this.state

    
    // 主题色
    const primaryColor = usePrimary ? primary : color

    // 文本阴影
    const getShadow = (c1, c2) => {
      return `1PX 1PX 2PX ${c1}, 0 0 0 ${c2}, 1PX 1PX 2PX ${c1}`
    }
    const textShadow = (type) => {
      let shadow
      if (isDark) {
        shadow = '1PX 1PX 2PX rgba(0,0,0,0.2)'
      } else if ( (is(type, 'percent') && counterValue > 50) || is(type, 'icon') ) {
        shadow = getShadow(hexToRgba(primaryColor, 0.7), '#5a5a5a')
      } else {
        shadow = getShadow(hexToRgba('#F4F5FB', 0.7), '#5a5a5a')
      }
      return shadow
    }
    const getPercentColor = () => {
      let color
      if (!detail && counterValue > 50) {
        color = hexToRgba('#ffffff', 0.9)
      } else {
        if(isDark) {
          color = hexToRgba('#ffffff', 0.6)
        } else {
          color = hexToRgba('#5a5a5a', 0.6)
        }
      }
      return color
    }

    const classProgress = cx({
      'my-progress': true,
      'light': !isDark,
      'dark': isDark,
      'detail': detail,
      'on-top': showColorSet
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
      'dark': isDark,
      'show': detail
    })
    const classDetailTitle = cx({
      'detail-title': true,
      'show': detail
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
    const classDetailProgressBar = cx({
      'detail-progress-bar': true,
      'light': !isDark,
      'dark': isDark
    })
    const classLeftCircle = cx({
      'left-circle': true
    })

    const styleProgress = {
      //color: primaryColor,
      width: width,
      height: detail ? `calc(${barHeight} * 2)` : barHeight,
      borderRadius: `${detail ? '2vw' : `calc(${barHeight} / 2)`}`,
      margin: '4vw auto',
    }
    const styleTypeName = {
      right: `calc(${barHeight} / 4)`,
      opacity: detail ? 0 : (100 - counterValue)/100,
    }
    const styleDetail = {
      width: width,
      opacity: showColorSet ? 0 : 1
    }
    const styleColorTitle = `
      --primary-rgb: ${this.hexToRgb(primaryColor)};
      --clip-width: ${ !detail ? '0' : showColorSet ? '28vw' : '15vw'};
      --clip-height: ${ !detail ? '0' : showColorSet ? '90%' : '50%'};
      --text-shadow: ${textShadow('icon')};
      --box-opacity: ${showColorSet || detail ? 1 : 0};
      --title-opacity: ${showColorSet ? 1 : 0};
      --title-color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)'};
      --transform: ${detail ? 'scale(1)' : 'scale(0)'};
      --border-radius: ${detail ? '2vw' : '7.5vw'};
    `
    const styleColorAction = `
      --action-opacity: ${showColorSet ? 1 : 0};
    `
    const styleLeftCircle = `
      --circle-color: ${this.hexToRgb(primaryColor)};
      --opacity: ${detail ? 1 : 0};
      --transform: ${detail ? 'scale(1) translate(-50%, -50%)' : 'scale(0) translate(-50%, -50%)'};
      --clip-path: ${detail ? '5PX' : '30PX'};
    `
    const styleDetailIcon = `
      --icon-color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)'};
      --text-shadow: ${textShadow('icon')};
    `
    const styleDetailProgress = `
      --width: ${detail ? 'calc(100% - 40PX)' : '100%'};
      --height: ${detail ? '10PX' : '100%'};
      --border-radius: ${detail ? '10PX' : '30PX'};
      --bottom: ${detail ? '30PX' : '0'};
    `

    const styleDetailProgressBar = `
      --width: ${counterValue + '%'};
      --height: ${detail ? '10PX' : '100%'};
      --primary-color: ${this.hexToRgb(primaryColor)};
      --percent: ${100 - counterValue + '%'};
      --border-radius: ${detail ? '10PX' : '30PX'};
    `

    const styleDetailPercent = `
      --left: ${counterValue + '%'};
      --transform: ${detail ? 'translate(-50%, 20PX)' : counterValue > 50 ? 'translateX(-150%)' : 'translateX(50%)'};
      --font-size: ${detail ? '20PX' : '30PX'};
      --color: ${getPercentColor()};
      --text-shadow: ${ detail ? textShadow('detail') : counterValue > 50 ? textShadow('percent') : textShadow('detail') };
    `

    return (
      <View
        className={classProgress}
        style={styleProgress}
        //onLongPress={this.onShowColorSet}
        >
        <View
          className={classTypeName}
          style={styleTypeName}
          >
          {type.toUpperCase()}
        </View>
        <View
          className={`color-title`}
          style={styleColorTitle}
          onClick={this.onToggleColorSet}
        >
        </View>
        <View
          className={`color-action`}
          style={styleColorAction}
        >
          <MyProgressColor 
            curColor={primaryColor}
            type={type}
          />
        </View>
        <View
          className={classLeftCircle}
          style={styleLeftCircle}
        ></View>
        <View
          className={classDetailIcon}
          style={styleDetailIcon}
          onClick={this.onToggleColorSet}
        >
          <MyIcon 
            name={ showColorSet ? 'close' : is(icon, 'week') ? 'week-' + weekStartDay : icon }
          />
        </View>
        <View
          className={classDetail}
          style={styleDetail}
          onClick={this.showDetail}
        >
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
                '未设置生日 🎂' :
                title
              }
            </Text>
          </View>
          <View
            className={classDetailProgress}
            style={styleDetailProgress}
          >
            <View
              className={classDetailPercent}
              style={styleDetailPercent}
            >
              <MyCounter 
                value={counterValue}
              />
            </View>
            <View 
              className={classDetailProgressBar}
              style={styleDetailProgressBar}
            >
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default MyProgress as ComponentType
