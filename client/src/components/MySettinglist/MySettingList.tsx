// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import hexToRgba from 'hex-to-rgba'

import './MySettingList.scss'
import MySettingItem from '../MySettingItem/MySettingItem'
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
        desc: '范围 1900至今',
        type: 'birth'
      },
      {
        title: '期望寿命',
        desc: '范围 50～150',
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
      }
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

  render () {
    const { themeStore: {systemInfo, isDark, primary } } = this.props
    const { settingList } = this.state
    let classDark = isDark ? 'dark' : 'light'

    let stylePage = {
      color: hexToRgba(primary, 0.8)
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
