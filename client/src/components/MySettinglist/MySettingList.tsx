// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Icon, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import hexToRgba from 'hex-to-rgba'

import './MySettingList.scss'
import MySettingItem from '../MySettingItem/MySettingItem'
import MyIcon from '../MyIcon/MyIcon'
import MyAvatar from '../MyAvatar/MyAvatar'

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    systemInfo: object,
    primary: string,
    birthday: string,
    avglife: number,
    explife: number,
    toggleDarkMode: Function,
  }
}

interface MySettingList {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MySettingList extends Component {
  static defaultProps = {
  }
  state = {
    touch: false,
    key: '',
    settingList: [
      {
        title: '亮暗模式',
        desc: '切换亮色、暗色模式',
        type: 'mode'
      },
      {
        title: '主题风格',
        desc: '选择主要颜色',
        type: 'theme'
      },
      {
        title: '出生年月',
        desc: '设置人生进度条的开始日期',
        type: 'birth'
      },
      {
        title: '期望寿命',
        desc: '设置人生进度条的跨度',
        type: 'life'
      },
      {
        title: '星期首日',
        desc: '选择每星期开始的第一天',
        type: 'week'
      },
      {
        title: '默认视图',
        desc: '切换默认进度条、详情',
        type: 'view'
      },
      {
        title: '默认样式',
        desc: '切换条形，方形',
        type: 'style'
      },
    ]
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentWillMount () {}

  componentDidMount () {}
  
  componentWillUnmount () {}
  
  componentDidShow () {}
  
  componentDidHide () {}

  componentWillReact () {}

  toggleDarkMode = () => {
    const { themeStore } = this.props
    themeStore.toggleDarkMode()
  }

  onTouch(e, key) {
    let type = e.type
    switch(type) {
      case 'touchstart':
        this.setState({
          touch: true,
          key
        })
        break
      case 'touchend':
        this.setState({
          touch: false,
          key: ''
      })
      break
    }
  }

  render () {
    const { themeStore: {systemInfo, isDark, primary } } = this.props
    const { settingList } = this.state
    let classDark = isDark ? 'dark' : 'light'

    let stylePage = {
      color: hexToRgba(primary, 0.6)
    }
    let styleList = {
      margin: `${46 + systemInfo.statusBarHeight}PX auto`
    }

    return (
      <View
        className={`my-setting-list ${classDark}`}
        style={stylePage}
      >
        <ScrollView 
          enableFlex={true}
          scrollY={true}
          className={`list ${classDark}`}
          >
          <View
            style={styleList}
          >
            <View
              className={`avatar-back ${classDark}`}
            >
              <View
                className={`avatar ${classDark}`}
              >
                <MyAvatar />
              </View>
              <View>
                LIUYIYUE
              </View>
            </View>
            {
              settingList.map(item => {
                return (
                  <MySettingItem 
                    key={item.type}
                    title={item.title}
                    desc={item.desc}
                    type={item.type}
                  />
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default MySettingList as ComponentType
