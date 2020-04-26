// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import hexToRgba from 'hex-to-rgba'

import './NewSettingList.scss'
import NewSettingItem from '../NewSettingItem/NewSettingItem'

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
  state = {
    newSettingList: [
      {
        title: '主题颜色',
        type: 'theme',
        position: 'lt',
        itemID: 0,
        state: 'normal'
      },
      {
        title: '人生进度',
        type: 'life',
        position: 'rt',
        itemID: 1,
        state: 'normal'
      },
      {
        title: '周起始日',
        type: 'week',
        position: 'lb',
        itemID: 2,
        state: 'normal'
      },
      {
        title: '默认视图',
        type: 'view',
        position: 'rb',
        itemID: 3,
        state: 'normal'
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

  onExpand = (itemID, expand) => {
    const { newSettingList } = this.state
    for (let i in newSettingList) {
      if(expand) {
        if(i == itemID) {
          newSettingList[i].state = 'zoom'
        } else {
          newSettingList[i].state = 'none'
        }
      } else {
        newSettingList[i].state = 'normal'
      }
    }
    this.setState({
      newSettingList: newSettingList
    })
  }

  render () {
    const { themeStore: { isDark, primary } } = this.props
    const { newSettingList } = this.state
    const classDark = isDark ? 'dark' : 'light'

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
                key={item.itemID}
                itemID={item.itemID}
                title={item.title}
                type={item.type}
                position={item.position}
                state={item.state}
                isDark={isDark}
                onExpand={(itemID, expand) => this.onExpand(itemID, expand)}
              />
            )
          })
        }
      </View>
    )
  }
}

export default NewSettingList as ComponentType
