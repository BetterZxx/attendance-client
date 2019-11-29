import { Button, Form, Input, Select, Upload, message,Radio } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import styles from './BaseView.less';

const FormItem = Form.Item;
const { Option } = Select; // 头像组件 方便以后独立，增加裁剪之类的功能
//fix bug
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload" onClick={()=>{message.warning('抱歉,这个功能暂时用不了！')}}>更换头像</Button>
      </div>
    </Upload>
  </Fragment>
);

const validatorGeographic = (_, value, callback) => {
  const { province, city } = value;

  if (!province.key) {
    callback('Please input your province!');
  }

  if (!city.key) {
    callback('Please input your city!');
  }

  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');

  if (!values[0]) {
    callback('Please input your area code!');
  }

  if (!values[1]) {
    callback('Please input your phone number!');
  }

  callback();
};

@connect(({ user:{userInfo} }) => ({
  
  userInfo
}))
class BaseView extends Component {
  view = undefined;

  componentDidMount() {
   // this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form,userInfo,dispatch } = this.props;
    form.validateFields((err,values) => {
      if (!err) {
        console.log(values)
        const payload = {
          ...userInfo,...values,createTime:''
        }
        dispatch({
          type:'accountSettings/updateUserInfo',
          payload
        })
       // message.success('更新基本信息成功');
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      userInfo,
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="姓名">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的姓名!',
                  },
                ],
                initialValue:typeof userInfo==='undefined'?'':userInfo.name
              })(<Input />)}
            </FormItem>
            <FormItem label="学号">
              {getFieldDecorator('studentID', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的学号!',
                  },
                ],
                initialValue:userInfo.studentID
              })(<Input />)}
            </FormItem>
            <FormItem label="性别">
              {getFieldDecorator('sex', {
                rules: [
                  {
                    required: true,
                    message: '请!',
                  },
                ],
                initialValue:userInfo.sex+''
              })(
                <Radio.Group>
                  <Radio value="1">男</Radio>
                  <Radio value="0">女</Radio>
                </Radio.Group>
                
              )}
            </FormItem>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的密码!',
                    
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <FormItem label="确认密码">
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: '请确认你的密码!',
                  },
                  {
                    validator:(rule,value,callback)=>{
                      const { getFieldValue } = this.props.form
                        if (value && value !== getFieldValue('password')) {
                            callback('两次输入不一致！')
                        }
                        callback()

                    }
                  },
                  
                ],
              
              })(<Input type="password"/>)}
            </FormItem>
            
            <FormItem label="年级">
              {getFieldDecorator('grade', {
                rules: [
                  {
                    required: true,
                    message: '请输入年级!',
                  },
                ],
                initialValue:userInfo.grade+''
              })(
                <Select>
                  <Option value='2017'>2017级</Option>
                  <Option value='2018'>2018级</Option>
                  <Option value='2019'>2019级</Option>
                  <Option value='2020'>2020级</Option>
                </Select>
              )}
            </FormItem>
           
            <Button type="primary" onClick={this.handlerSubmit}>
              更新基本信息
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={userInfo.sex===1?'http://118.24.95.11:5678/pig1.jpg':'http://118.24.95.11:5678/pig0.jpg'} />
        </div>
      </div>
    );
  }
}

export default Form.create()(BaseView);
