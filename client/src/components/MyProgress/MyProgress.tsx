// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import classNames from 'classnames/bind'
import styles from './MyProgress.scss'
import MyIcon from '../MyIcon/MyIcon'
import MyCounter from '../MyCounter/MyCounter'

let cx = classNames.bind(styles)

class MyProgress extends Component {
  static defaultProps = {
    name: '年进度',
    title: '',
    percent: 50,
    color: '#009BEC',
    icon: 'earth',
    time: 2020,
    width: '84vw',
    barHeight: 40,
    isDark: false,
    isAnim: true,
    type: 'year',
    editable: false,
    birthday: '1993-1-1',
    avglife: 77,
    explife: 0
  }
  
  state = {
    counterValue: this.props.percent * .5,
    startX: 0,
    x: 0,
    translateX: 0,
    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opening: false,
    detail: false,
    opacity: 0,
    life: this.props.explife ? this.props.explife : this.props.avglife
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
      this.setState({
        counterValue: percent * .8
      })
      setTimeout(() => {
        this.setState({
          counterValue: percent
        })
      }, 500)
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

  componentWillReact () {
  }

  handleStart = (e) => {
    e.preventDefault()
    this.setState({
      startX: e.touches[0].clientX,
      x: 0,
      transition: ''
    })
  }

  handleTouchMove = (e) => {
    const { barHeight } = this.props
    const { startX, opening } = this.state //取得初始坐标和屏幕可视宽高    
    let x = e.touches[0].clientX - startX
    if (opening) {
      x += barHeight
    }
    let percent = x / (barHeight) 
    let opacity = 0
    if (percent > 1) {
      opacity = 1
    } else if (percent < 0) {
      opacity = 0
    } else {
      opacity = percent
    }
    this.setState({
      ///都可以来设置实时变化的值，不用用到changedTouches；
      x: x, //当前触摸点-初始坐标取得实时变化值
      translateX: x > 0 ? x : 0,
      opacity: opacity
    })
  }

  handleTouchEnd = () => {
    const { barHeight } = this.props
    const { x } = this.state
    let translateX = 0
    if (x >= barHeight/2 ) {
      translateX = barHeight
    }
    this.setState({
      translateX: translateX,
      transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      opening: translateX ? true : false,
      detail: false,
      opacity: translateX ? 1 : 0
    })
  }

  showAction = () => {
    const { opening } = this.state
    this.setState({
      opening: !opening,
      detail: false,
      opacity: opening ? 0 : 1,
      translateX: opening ? 0 : 40
    })
  }

  showDetail = () => {
    const { opening, detail } = this.state
    if (opening) return
    this.setState({
      detail: !detail
    })
  }

  render () {

    const { name, title, time, percent, color, width, barHeight, isDark, isAnim, icon, type, birthday, onRemoveItem } = this.props

    const { counterValue, translateX, transition, opening, detail, opacity, life } = this.state

    let classProgress = cx({
      'my-progress': true,
      'light': !isDark,
      'dark': isDark
    })
    let classRemoveBtn = cx({
      'remove-btn': true,
      'light': !isDark,
      'dark': isDark
    })
    let classIcon = cx({
      'my-icon': true
    })
    let classDetail = cx({
      'detail': true
    })
    let classBarcolor = cx({
      'bar-color': true
    })
    let classBarTitle = cx({
      'bar-title': true
    })
    let classPercent = cx({
      'percent': true,
      'left': counterValue > 50,
      'right': counterValue <= 50
    })

    let styleProgress = {
      color: color,
      width: width,
      height: barHeight + 'PX',
      borderRadius: `${barHeight / 8}PX`,
      margin: '4vw',
    }
    let styleRemoveBtn = {
      width: barHeight + 'PX',
      height: barHeight + 'PX',
      left: 0,
      opacity: opacity
    }
    let styleBarcolor = {
      width: opening ? `calc(100% - ${barHeight}PX)` : counterValue + '%',
      height: detail ? '25%' : '100%',
      borderRadius: `${barHeight / 8}PX`,
      transform: `translateX(${translateX}px)`,
      transition: transition,
      background: color,
      bottom: 0,
      left: 0
    }
    let styleBarTitle = {
      opacity: detail ? 0 : opacity
    }
    let stylePercent = {
      color: counterValue > 50 ? '#fafafa' : color,
      opacity: detail ? 0 : 1 - opacity
    }
    let styleMyIcon = {
      position: 'absolute',
      top: 0,
      right: barHeight / 4 + 'PX',
      height: barHeight + 'PX',
      opacity: detail ? 0 : 1 - opacity
    }
    let styleDetail = {
      opacity: detail ? 1 - opacity : 0
    }
    return (
      <View
        className={classProgress}
        style={styleProgress}
        onClick={this.showAction}
        onLongPress={this.showDetail}
      >
        <View 
          className={classRemoveBtn} 
          style={styleRemoveBtn}
          onClick={onRemoveItem}
        >
          <MyIcon 
            name='remove'
            size={barHeight/2}
            color='#FF5E5B'
          />
        </View>
          <View
            className={classIcon}
            style={styleMyIcon}
          >
            {type.toUpperCase()}
          </View>
          <View
            className={classDetail}
            style={styleDetail}
          >
            {title}{percent}%
          </View>
          <View 
            className={classBarcolor}
            style={styleBarcolor}
          >
            <View 
              className={classBarTitle}
              style={styleBarTitle}
            >
              {
                type === 'week' ? 
                <View>
                  周起始：周日
                </View> :
                type === 'life' ?
                <View
                >
                 生日：{birthday} 期望寿命：{life}
                </View> :
                <View>
                  {name}：{percent}%
                </View>
              }
            </View>
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
