import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: '我的'
  }

  state = {
    oauthBtnStatus: true, // 授权按钮是否显示 默认为显示
    userInfo: null, // 用户信息
    btnText: '微信授权登录'
  }

  componentWillMount () { }

  componentDidMount () { 
   this.getOauthStatus()
  }

  getOauthStatus = () => {
    Taro.getSetting().then(res => {
      console.log(111,res)
      if(Object.keys(res.authSetting).length === 0 || !res.authSetting['scope.userInfo']){ // 用户信息无授权
        console.log(res.authSetting)
        console.log('用户无授权信息')
      }else{ // 用户允许授权获取用户信息
        // 隐藏授权按钮
        this.setState({oauthBtnStatus: false})
        // 获取用户信息
        this.getUserInfo()
      }
    })
    .catch(err => console.log(err))
  }

  getUserInfo = () => {
    Taro.getUserInfo({
      lang: 'zh_CN'
    }).then( res => { // 获取成功
      console.log(22,res)
      this.setState(()=>({
        userInfo: res.userInfo
      }))
      console.log(res)
    } )
    .catch( err => console.log(err) )
  }
  // 用户授权操作后按钮回调
  onGotUserInfo = res => {
    console.log('onGotUserInfo',res)
    if(res.detail.userInfo){ // 返回的信息中包含用户信息则证明用户允许获取信息授权
      console.log('授权成功')
    }else{ // 用户取消授权，进行提示，促进重新授权
      Taro.showModal({
        title: '温馨提示',
        content: '简单的信任，是你我俩故事的开始',
        showCancel: false // 不展示取消按钮
      })
        .then(ModalRes => {
          if(ModalRes.confirm){ // 点击确定按钮
            this.setState({btnText:'重新授权登录'})
          }
        })
    }
  }
  componentWillUnmount () { 
    // 获取用户当前授权状态
    this.getOauthStatus()
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { oauthBtnStatus, userInfo, btnText } = this.state
    return (
      <View className='index'>
        <Text>my!</Text>
        <Button className='btn-max-w' plain type='primary' >按钮</Button>
        <View className='login-page'>
        {/* <Image src={loginFile} mode='aspectFit' className='login-img' /> */}
        { oauthBtnStatus ? <Button className='login-btn' openType='getUserInfo' onGetUserInfo={this.onGotUserInfo}>{btnText}</Button> : ''}
        { userInfo ? JSON.stringify(userInfo) : ''}
        { userInfo ? <Image src={userInfo.avatarUrl} /> : ''}
      </View>
      </View>)  
  }
}
