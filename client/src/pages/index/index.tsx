import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Textarea } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <View className="input-container">
          <Textarea className='textarea' placeholder='请输入日程信息...' placeholderClass="placeholder"/>
        </View>
        <Button className="btn parse-btn" hoverClass="btn__hover" onClick={() => {Taro.navigateTo({
          url: '/pages/edit/edit'
        })}}>解析日程</Button>
      </View>
    )
  }
}
