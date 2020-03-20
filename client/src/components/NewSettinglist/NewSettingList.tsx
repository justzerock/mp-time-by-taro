// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import classNames from 'classnames/bind'
import hexToRgba from 'hex-to-rgba'

import styles from './NewSettingList.scss'
import NewSettingItem from '../NewSettingItem/NewSettingItem'
import MyAvatar from '../MyAvatar/MyAvatar'

const cx = classNames.bind(styles)

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

interface NewSettingList {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class NewSettingList extends Component {
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
    ],
    newSettingList: [
      {
        title: '主题颜色',
        type: 'theme',
        position: 'lt',
        id: 1
      },
      {
        title: '人生进度',
        type: 'life',
        position: 'rt',
        id: 2
      },
      {
        title: '周起始日',
        type: 'week',
        position: 'lb',
        id: 3
      },
      {
        title: '默认视图',
        type: 'view',
        position: 'rb',
        id: 4
      },
    ],
    expandState: 'default',
    current: 0
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

  onExpand = (expand) => {
    this.setState({
      expandState: expand ? 'expand' : 'default'
    })
  }

  render () {
    const { themeStore: {systemInfo, isDark, primary } } = this.props
    const { settingList, newSettingList, current, expandState } = this.state
    const classDark = isDark ? 'dark' : 'light'

    const classSettingItem = cx({
      'setting-item': true
    })
    const stylePage = {
      color: hexToRgba(primary, 0.6)
    }

    return (
      <View
        className={`setting-list ${classDark}`}
        style={stylePage}
      >
        {
          newSettingList.map(item => {
            return (
              <NewSettingItem 
                key={item.id}
                itemID={item.id}
                title={item.title}
                type={item.type}
                position={item.position}
                current={current}
                expandState={expandState}
                isDark={isDark}
                onExpand={(id, expand) => this.onExpand(id, expand)}
              />
            )
          })
        }
      </View>
    )
  }
}

export default NewSettingList as ComponentType
