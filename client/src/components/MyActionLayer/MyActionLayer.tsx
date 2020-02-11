// eslint-disable-next-line no-unused-vars
import { ComponentType } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './MyActionLayer.scss'
import MyIcon from '../MyIcon/MyIcon'
import MyActionItem from '../MyActionItem/MyActionItem'

type PageStateProps = {
  themeStore: {
    isDark: boolean,
    list: Array<Object>,
    setListData: Function
  }
}

interface MyActionLayer {
  props: PageStateProps;
}

@inject('themeStore')
@observer
class MyActionLayer extends Component {
  static defaultProps = {
    expand: false
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  componentWillMount () {}

  componentDidMount () { }
  
  componentWillUnmount () { }
  
  componentDidShow () { }
  
  componentDidHide () { }

  componentWillReact () {
  }

  toggleItem = (type, selected) => {
    const { themeStore } = this.props
    let newList = themeStore.list
    let index = newList.findIndex(item => item.type === type)
    newList[index].selected = selected
    themeStore.setListData(newList, Date.now(), false)
  }

  render () {
    const { themeStore: { isDark, list } , expand, onAdd } = this.props
    let classExpand = expand ? 'open' : 'close'
    let classDark = isDark ? 'dark' : 'light'
    return (
      <View
        className='my-action-layer'
      >
        <View 
          className={`full-layer ${classExpand}`}
          onClick={onAdd}
        />
        <View
          className={`main ${classExpand} ${classDark}`}
        >
          <View
            className='action-title'
          >
            <View
              className='title-icon'
            >
              <MyIcon 
                name='progress'
                size='20'
                color={isDark ? '#fafafa' : '#333'}
              />
            </View>
            添加进度条
            <View
              className={`close-btn ${classDark}`}
              onClick={onAdd}
            >
              <MyIcon 
                name='close'
                size='20'
                color={isDark ? '#fafafa' : '#333'}
              />
            </View>
          </View>
          <View
            className='action-list'
          >
            <View
              className='action-list-addable'
            >
              <View
                className='list-addable-title'
              >
                可添加
              </View>
              {list
                .filter(item => !item.selected)
                .map(
                  (item, index) => {
                    return (
                      <MyActionItem 
                        key={'key' + index}
                        name={item.name}
                        percent={item.percent}
                        color={item.color}
                        selected={item.selected}
                        type={item.type}
                        isDark={isDark}
                        onToggleItem={()=>this.toggleItem(item.type, true)}
                      />
                    )
                  }
              )}
            </View>
            <View 
              className='action-list-added'
            >
              <View
                className='list-added-title'
              >
                已添加
              </View>
              {list
                .filter(item => item.selected)
                .map(
                  (item, index) => {
                    return (
                      <MyActionItem 
                        key={'key' + index}
                        name={item.name}
                        percent={item.percent}
                        color={item.color}
                        selected={item.selected}
                        type={item.type}
                        editable={item.editable}
                        isDark={isDark}
                        onToggleItem={()=>this.toggleItem(item.type, false)}
                      />
                    )
                  }
              )}
            </View>
          </View>
        </View>

      </View>
    )
  }
}

export default MyActionLayer as ComponentType
