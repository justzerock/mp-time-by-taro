// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import classNames from 'classnames/bind'

import styles from './index.scss'
import MyNavBar from '../../components/MyNavBar/MyNavBar'
import MyProgress from '../../components/MyProgress/MyProgress'
import MyFloatButton from '../../components/MyFloatButton/MyFloatButton'
import MyActionLayer from '../../components/MyActionLayer/MyActionLayer'
import NewSettingList from '../../components/NewSettingList/NewSettingList'
import '../../assets/myfont.scss'

let cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    primary: string,
    isDark: boolean,
    isDetail: boolean,
    isRight: boolean,
    hasHomeBar: boolean,
    systemInfo: object,
    list: Array<Object>,
    updateTime: number,
    birthday: Array<number>,
    avglife: number,
    explife: number,
    weekStartDay: number,
    setListData: Function,
    setUpdateData: Function,
    setNavBarTitle: Function,
    getListData: Function,
    getSystemInfo: Function,
    getMenuButton: Function,
    getPrimaryColor: Function,
    getExpLife: Function,
    getBirthDay: Function,
    getDarkMode: Function,
    getWeekStartDay: Function,
    getViewMode: Function
  }
}

interface Index {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class Index extends Component {
  state = {
    expand: false,
    dateSel: '1993-1-1',
    startX: 0,
    x: 0,
    translateX: 0,
    transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    current: '0'
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentWillMount () {
    this.onUpdate()
  }
  
  componentDidMount () { 
  }
  
  componentWillUnmount () { 
    clearInterval(this._interval)
  }
  
  componentDidShow () {
  }
  
  componentDidHide () {
  }

  componentWillReact () { }

  onUpdate = () => {
    const { themeStore } = this.props
    themeStore.getExpLife()
    themeStore.getBirthDay()
    themeStore.getWeekStartDay()
    themeStore.getPrimaryColor()
    themeStore.getDarkMode()
    themeStore.getViewMode()
    themeStore.getSystemInfo()
    themeStore.getMenuButton()
    setTimeout(() => {
      themeStore.getListData()
    }, 100)
    this._interval = setInterval(() => {
      themeStore.setUpdateData(0, true)
    }, 60 * 1000)
  }

  onAddToggle = () => {
    const { expand } = this.state
    this.setState({
      expand: !expand
    })
  }

  onAddCancle = () => {
    this.setState({
      expand: false
    })
  }

  onDateChange = (e) => {
    this.setState({
      dateSel: e.detail.value
    })
  }

  onSwipItem = (e) => {
    const { themeStore } = this.props
    let current = e.detail.current
    let isRight = current ? true : false
    let title = current ? '设置' : '亦时'
    themeStore.setNavBarTitle(title, isRight)
  }

  removeItem = (type) => {
    const { themeStore } = this.props
    let newList = themeStore.list
    let index = newList.findIndex(item => item.type === type)
    newList[index].selected = false
    themeStore.setListData(newList, Date.now(), false)
  }

  render () {
    const { themeStore: { primary, isDark, isDetail, weekStartDay, birthday, isRight, hasHomeBar, systemInfo, list } } = this.props
    const { expand } = this.state

    let classIndex = cx({
      'index': true,
      'light': !isDark,
      'dark': isDark
    })
    let classSwiper = cx({
      'swiper': true
    })
    let classSwiperItem = cx({
      'swiper-item': true
    })
    let classList = cx({
      'list': true
    })
    let classFloatBtn = cx({
      'float-btn': true,
      'hidden': isRight
    })
    let classScrollList = cx({
      'scroll-list': true
    })

    let styleList = {
      padding: `${46 + systemInfo.statusBarHeight}PX 0`
    }
    let styleFloatBtn = {
      bottom: hasHomeBar ? '44PX' : '4vw'
    }
    return ( 
      <View
        className={classIndex}
      >
        <MyNavBar />
        <Swiper
          className={classSwiper}
          onChange={this.onSwipItem}
        >
          <SwiperItem
            className={classSwiperItem}
          >
              <View 
                className={classScrollList}
              >
                <View 
                  className={classList}
                  style={styleList}
                >
                  {
                    list
                    .filter(item => item.selected)
                    .map(
                      item => {
                        return (
                          <MyProgress 
                            key={item.type + item.time}
                            name={item.name}
                            title={item.title}
                            percent={item.percent}
                            time={item.time}
                            icon={item.icon}
                            color={item.color}
                            type={item.type}
                            isDark={isDark}
                            isDetail={isDetail}
                            birthday={birthday}
                            weekStartDay={weekStartDay}
                            primary={primary}
                          />
                        )
                      }
                    )
                  }
                </View>
              </View>
          </SwiperItem>
          <SwiperItem
            className={classSwiperItem}
          >
            <NewSettingList />
          </SwiperItem>
        </Swiper>
        <View
          className={classFloatBtn}
          style={styleFloatBtn}
        >
          <MyFloatButton 
            isDark={isDark}
            onAdd={this.onAddToggle}
          />
        </View>
        <MyActionLayer 
          expand={expand}
          onAdd={this.onAddCancle}
          isDark={isDark}
        />
      </View>
    )
  }
}

export default Index  as ComponentType
