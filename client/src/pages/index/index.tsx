// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import classNames from 'classnames/bind'

import styles from './index.scss'
import MyNavBar from '../../components/MyNavBar/MyNavBar'
import MyProgress from '../../components/MyProgress/MyProgress'
import MyFloatButton from '../../components/MyFloatButton/MyFloatButton'
import MyActionLayer from '../../components/MyActionLayer/MyActionLayer'
import MySettingList from '../../components/MySettingList/MySettingList'
import MyInfo from '../../components/MyInfo/MyInfo'
import MyFirstTip from '../../components/MyFirstTip/MyFirstTip'
import MyFirstButton from '../../components/MyFirstButton/MyFirstButton'

import '../../assets/myfont.scss'
import hexToRgba from 'hex-to-rgba'

let cx = classNames.bind(styles)

type PageStateProps = {
  themeStore: {
    primary: string,
    isDark: boolean,
    isDetail: boolean,
    isRight: boolean,
    isShare: boolean,
    hasHomeBar: boolean,
    isFirst: boolean,
    navInfo: object,
    list: Array<Object>,
    birthday: Array<number>,
    avglife: number,
    explife: number,
    weekStartDay: number,
    usePrimary: boolean,
    setListData: Function,
    setUpdateData: Function,
    setNavBarTitle: Function,
    setIsFirst: Function,
    getListData: Function,
    getNavInfo: Function,
    getPrimaryColor: Function,
    getUsePrimary: Function,
    getExpLife: Function,
    getBirthDay: Function,
    getDarkMode: Function,
    getWeekStartDay: Function,
    getViewMode: Function,
    getUseCloudSync: Function,
    getIsFirst: Function
  }
}

interface Index {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class Index extends Component {
  state = {
    showAction: false,
    showInfo: false,
    showFullLayer: false,
    showListFullLayer: false,
    showSettingList: false,
    showColorSet: { index: '', show: false},
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

  onShareAppMessage () {
    const { themeStore } = this.props
    themeStore.isShare = true
    setTimeout(() => {
      themeStore.isShare = false
    }, 100);
    return {
      title: '👍 亦时 - 人生进度条',
      path: '/pages/index/index'
    }
  }

  onUpdate = () => {
    const { themeStore } = this.props
    themeStore.getIsFirst()
    themeStore.getUseCloudSync()
    themeStore.getExpLife()
    themeStore.getBirthDay()
    themeStore.getWeekStartDay()
    themeStore.getPrimaryColor()
    themeStore.getUsePrimary()
    themeStore.getDarkMode()
    themeStore.getViewMode()
    themeStore.getNavInfo()
    themeStore.getListData()

    /**  
     * code start
     */
    const myDate = new Date()
    const myDateS = myDate.getSeconds()*1000
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

  // 显示帮助信息
  onShowInfo = () => {
    const { showInfo, showFullLayer } = this.state
    this.setState({
      showFullLayer: !showFullLayer,
      showInfo: !showInfo
    })
  }
  onHideInfo = () => {
    this.setState({
      showInfo: false,
      showFullLayer: false
    })
  }

  // 开启悬浮操作窗
  onShowManage = () => {
    this.setState({
      showFullLayer: true,
      showAction: true
    })
  }

  // 关闭悬浮操作窗
  onHideManage = () => {
    this.setState({
      showAction: false,
      showFullLayer: false
    })
  }

  // 关闭遮罩层
  closeFullLayer = () => {
    this.setState({
      showAction: false,
      showInfo: false,
      showFullLayer: false,
      showSettingList: false
    })
  }

  // 显示遮罩层
  onShowListFullLayer = () => {
    this.setState({
      showListFullLayer: true,
    })
  }

  // 关闭遮罩层
  onCloseListFullLayer = () => {
    this.setState({
      showColorSet: {index: '', show: false},
      showListFullLayer: false,
    })
  }

  // 显示设置列表
  onShowSettingList = () => {
    this.setState({
      showFullLayer: true,
      showSettingList: true
    })
  }

  // 隐藏设置列表
  onHideSettingList = () => {
    this.setState({
      showSettingList: false,
      showFullLayer: false
    })
  }

  // 设置初始提示
  onSetFirst = () => {
    const { themeStore } = this.props
    themeStore.setIsFirst(false)
    this.setState({
      showFullLayer: false
    })
  }

  render () {
    const { 
      themeStore: { 
        primary, usePrimary, isFirst, isDark, isDetail, isShare, weekStartDay, birthday, isRight, hasHomeBar, navInfo, list 
      } 
    } = this.props
    const { showAction, showInfo, showFullLayer, showListFullLayer, showColorSet, showSettingList } = this.state

    const content = [
      '点击进度条切换视图\n点击图标设置主题色',
      '点击按钮管理进度条'
    ]

    let classIndex = cx({
      'index': true,
      'light': !isDark,
      'dark': isDark
    })
    let classList = cx({
      'list': true,
      'share': isShare
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

    let globalVariables = `
    --primary-light: ${primary};
    --primary-dark: ${hexToRgba(primary, 0.8)};
    --text-normal: ${isDark ? hexToRgba('#ffffff', 0.6) : hexToRgba('#5a5a5a', 0.6)};
    --text-percent: ${isDark ? hexToRgba('#414141', 0.6) : hexToRgba('#F4F5FB', 0.9)};
    `
    const styleFullLayer =  `
      --background: ${showFullLayer || isFirst ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0)'};
      --z-index: ${showFullLayer || isFirst ? 1000 : -1}
    `
    const styleListFullLayer = `
      --layer-background: ${showListFullLayer ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0)'};
      --z-index: ${showListFullLayer ? 1000 : -1}
    `
    return ( 
      <View
        className={classIndex}
        style={globalVariables}
      >
        <View
          className={`full-layer`}
          style={styleFullLayer}
          onClick={this.closeFullLayer}
        ></View>
        <MyNavBar />

        <View 
          className={classScrollList}
        >
          <View 
            className={classList}
            style={styleList}
          >
            <View
              className={`list-full-layer`}
              style={styleListFullLayer}
              onClick={this.onCloseListFullLayer}
            ></View>
            {
              list
              .filter(item => item.selected)
              .map(
                item => {
                  return (
                    <MyProgress 
                      key={item.type}
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
                      usePrimary={usePrimary}
                      windowWidth={navInfo.windowWidth}
                      windowHeight={navInfo.windowHeight}
                      onShowListFullLayer={this.onShowListFullLayer}
                      onCloseListFullLayer={this.onCloseListFullLayer}
                      showColorSet={showColorSet}
                    />
                  )
                }
              )
            }
          </View>
        </View>
        <View
          className={classFloatBtn}
          style={styleFloatBtn}
        >
          <MyFloatButton 
            isDark={isDark}
            primary={primary}
            onSettingList={this.onShowSettingList}
            onManage={this.onShowManage}
            onShowInfo={this.onShowInfo}
            onHideInfo={this.onHideInfo}
          />
        </View>
        <MyActionLayer 
          isShow={showAction}
          onManage={this.onHideManage}
          isDark={isDark}
        />
        <MyInfo 
          hasHomeBar={hasHomeBar}
          isShow={showInfo}
          isDark={isDark}
          onHideInfo={this.onHideInfo}
          primary={primary}
        />
        <MySettingList 
          hasHomeBar={hasHomeBar}
          isShow={showSettingList}
          onHide={this.onHideSettingList}
        />
        <MyFirstTip
          isTop={true}
          content={content[0]}
          hasHomeBar={hasHomeBar}
          isShow={isFirst}
          isDark={isDark}
        />
        <MyFirstTip
          isTop={false}
          content={content[1]}
          hasHomeBar={hasHomeBar}
          isShow={isFirst}
          isDark={isDark}
        />
        <MyFirstButton 
          isShow={isFirst}
          onSetFirst={this.onSetFirst}
          isDark={isDark}
        />
      </View>
    )
  }
}

export default Index  as ComponentType
