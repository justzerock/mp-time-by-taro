// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'

import styles from './MyProgress.scss'
import MyIcon from '../MyIcon/MyIcon'
import MyCounter from '../MyCounter/MyCounter'

let cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    primary: string,
    colors: Array<string>,
    wStart: number,
    systemInfo: object,
    birthday: string,
    avglife: number,
    explife: number,
    toggleDarkMode: Function,
    setPrimaryColor: Function,
    setExpLife: Function,
    setBirthDay: Function,
    setUpdateData: Function
  },
  name: string,
  title: string,
  percent: number,
  color: string,
  icon: string,
  time: number,
  width: string,
  barHeight: number,
  isDark: boolean,
  isAnim: boolean,
  type: string,
  birthday: string,
  avglife: number,
  explife: number,
  colorLight: string,
  colorDark: string
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
    isAnim: true,
    type: 'year',
    birthday: '',
    avglife: 77,
    explife: 0,
    colorLight: '#dde1e7',
    colorDark: '#233541'
  }
  
  state = {
    counterValue: this.props.percent * .5,
    detail: false,
    life: this.props.explife ? this.props.explife : this.props.avglife,
    progressTouch: false
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
    }, 500)
  }

  componentDidUpdate (prevProps) {
    const { isDark, percent } = this.props
    if (isDark !== prevProps.isDark || percent !== prevProps.percent) {
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
  
  onProgressTouch(e) {
    let type = e.type
    switch(type) {
      case 'touchstart':
        this.setState({
          progressTouch: true
        })
        break
      case 'touchend':
        this.setState({
          progressTouch: false
        })
        break
    }
  }

  render () {

    const { themeStore: { primary },  name, title, time, percent, color, width, barHeight, isDark, isAnim, icon, type, birthday, colorLight, colorDark } = this.props

    const { counterValue, detail, progressTouch } = this.state

    let getShadow = (c1, c2) => {
      return `1PX 1PX 2PX ${c1}, 0 0 0 ${c2}, 1PX 1PX 2PX ${c1}`
    }
    let textShadow = (type) => {
      let shadow
      if ( (type === 'percent' && counterValue > 50) || type === 'title'  ) {
        shadow = getShadow(color, colorDark)
      } else if (isDark) {
        shadow = '1PX 1PX 2PX rgba(0,0,0,0.4)'
      } else {
        shadow = getShadow(colorLight, colorDark)
      }
      return shadow
    }

    let classProgress = cx({
      'my-progress': true,
      'light': !isDark,
      'dark': isDark,
      'touch': progressTouch,
      'detail': detail
    })
    let classTypeName = cx({
      'type-name': true
    })
    let classDetail = cx({
      'detail': true
    })
    let classDetailIcon = cx({
      'detail-icon': true,
      'light': !isDark,
      'dark': isDark
    })
    let classDetailTitle = cx({
      'detail-title': true
    })
    let classDetailName = cx({
      'detail-name': true
    })
    let classDetailDesc = cx({
      'detail-desc': true
    })
    let classDetailPercent = cx({
      'detail-percent': true
    })
    let classBarcolor = cx({
      'bar-color': true,
      'light': !isDark,
      'dark': isDark
    })
    let classPercent = cx({
      'percent': true,
      'left': counterValue > 50,
      'right': counterValue <= 50
    })

    let styleProgress = {
      color: color,
      width: width,
      height: detail ? barHeight*2 + 'PX' : barHeight + 'PX',
      borderRadius: `${barHeight / 4}PX`,
      margin: '4vw',
    }
    let styleBarcolor = {
      width: detail ? '0' : counterValue + '%',
      borderRadius: `${barHeight / 4}PX`,
      background: color
    }
    let stylePercent = {
      color: counterValue <= 50 ? hexToRgba(color, 0.6) : hexToRgba('#efefef', 0.8),
      textShadow: textShadow('percent'),
      opacity: detail ? 0 : 1
    }
    let styleTypeName = {
      right: barHeight / 4 + 'PX',
      opacity: detail ? 0 : 1,
      textShadow: textShadow('type'),
      color: hexToRgba(color, 0.6)
    }
    let styleDetail = {
      width: width,
      textShadow: textShadow('detail'),
      color: hexToRgba(primary, 0.6),
      opacity: detail ? 1 : 0
    }
    let styleDetailIcon = {
    }
    let styleDetailTitle = {}
    let styleDetailName = {}
    let styleDetailDesc = {
      color: hexToRgba(primary, 0.6)
    }
    let styleDetailPercent = {
      color: hexToRgba(primary, 0.6)
    }

    return (
      <View
        className={classProgress}
        style={styleProgress}
        onClick={this.showDetail}
        onTouchStart={this.onProgressTouch}
        onTouchEnd={this.onProgressTouch}
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
            style={styleDetailIcon}
          >
            <MyIcon 
              name={icon}
              size={barHeight*0.6}
              color={hexToRgba(primary, 0.6)}
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
            <View
              className={classDetailDesc}
              style={styleDetailDesc}
            >
              {title}
            </View>
          </View>
          <View
            className={classDetailPercent}
            style={styleDetailPercent}
          >
            <MyCounter 
              value={counterValue}
            />
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
      </View>
    )
  }
}

export default MyProgress as ComponentType
