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
    navInfo: object,
    list: Array<Object>,
    birthday: Array<number>,
    avglife: number,
    explife: number,
    weekStartDay: number,
    setListData: Function,
    setUpdateData: Function,
    setNavBarTitle: Function,
    getListData: Function,
    getNavInfo: Function,
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
  
  componentWillUnmount () { }
  
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
    themeStore.getNavInfo()
    setTimeout(() => {
      themeStore.getListData()
    }, 100)

    /**  
     * code start
     */
    const myDate = new Date()
    const myDateS = myDate.getSeconds()
    const myDateMs = 1000 - myDate.getMilliseconds()
    setTimeout(function () {
      update()
    },60000 - myDateS - myDateMs)
    // 减去秒数与毫秒数，下次执行即为整分钟
    function update() {
      themeStore.setUpdateData()
      setTimeout(function () {
        update()
      },60000)
    }
    /** 
     * code end
     * 本段代码参考
     * 作者：神也看不懂
     * 标题：JS整时整分整点事件
     * https://blog.csdn.net/NaXieNianDeii/article/details/103015069
     */
  }

  // 开启悬浮操作窗
  onAddToggle = () => {
    const { expand } = this.state
    this.setState({
      expand: !expand
    })
  }

  // 关闭悬浮操作窗
  onAddCancle = () => {
    this.setState({
      expand: false
    })
  }

  // 当滑动页面
  onSwipItem = (e) => {
    const { themeStore } = this.props
    let current = e.detail.current
    let isRight = current ? true : false
    let title = current ? '设置' : '亦时'
    themeStore.setNavBarTitle(title, isRight)
  }

  render () {
    const { themeStore: { primary, isDark, isDetail, weekStartDay, birthday, isRight, hasHomeBar, navInfo, list } } = this.props
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
      padding: `calc(46PX + ${navInfo.navTop}) 0`
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
