import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Modal,
  Timeline,
  Select,
  message,
  Descriptions
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

const FormItem = Form.Item;
const {TextArea} = Input
/* eslint react/no-multi-comp:0 */
@connect(({ listTableList, loading,announcement }) => ({
  listTableList,
  loading: loading.models.listTableList,
  isModify:announcement.isModify,
  detail:announcement.detail
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    detailModalVisible:false,
  };

  
  handleChange = (value) => {
    const {dispatch} = this.props
    dispatch({
      type:'announcement/changeDetail',
      payload:{
        content:value
      }
    })
  }
  componentDidMount(){
    const {detail,dispatch,isModify} = this.props
    console.log('detail',detail)
    if(!isModify)
    dispatch({
      type:'announcement/changeDetail',
      payload:{
        title:'',
        content:''
      }
    })
  }
  handleSave = ()=>{
    const {dispatch,isModify,detail} = this.props
    const {title,content} = detail
    console.log(isModify)
    if(isModify){
      dispatch({
        type:'announcement/update',
        payload:{
          announcementId:detail.id,
          content,
          title
        }
      })
    }else{
      dispatch({
        type:'announcement/saveAnnouncement',
        payload:{
          content,
          title
        }
      })
    }
  }
  handlePublich = ()=>{
    const {dispatch,isModify,detail} = this.props
    const {content,title} = detail
    if(isModify){
      dispatch({
        type:'announcement/publishSaved',
        payload:{
          announcementId:detail.id,
          content,
          title
        }
      })
    }else{
      dispatch({
        type:'announcement/publish',
        payload:{
          content,
          title
        }
      })
    }
  }
  onInputChange = (e)=>{
    const {dispatch} = this.props
    dispatch({
      type:'announcement/changeDetail',
      payload:{
        title:e.target.value
      }
    })
  }
  handleCancelPublish = ()=>{
    const {dispatch,detail} = this.props
    dispatch({
      type:'announcement/cancelPublish',
      payload:{
        announcementId:detail.id
      }
    })
  }
  render() {
    const { form ,isModify,detail} = this.props;
    const { getFieldDecorator } = form;
    
    const title = <div>
      <span>标题 :</span>
        <Input placeholder='标题' style={{width:'80%',marginLeft:15} } value={detail.title} onChange={this.onInputChange}></Input>
    </div>
    const extra = <div>
      {isModify?<span style={{marginRight:18}}>
        <span> 状态: {detail.status===1?'已发布 ':'未发布 '}</span><Badge status={detail.status===1?'processing':'default'}/>
      </span>:''}
      <Button type='primary' onClick={this.handlePublich}>发布</Button>
      {!isModify?'':<Button type='primary' style={{marginLeft:15}} onClick={this.handleCancelPublish}>取消发布</Button>}
      <Button style={{margin:'0 15px'}} onClick={this.handleSave}>保存</Button>
      <Button onClick={()=>{this.props.history.goBack()}}>返回</Button>
    </div>
    
    return (
      <PageHeaderWrapper
      extra={extra}
      title={isModify?'修改公告':'新增公告'}
      
      
      >
        <Card
          title={title}
        >
          正文
          <ReactQuill value={detail.content }
                  onChange={this.handleChange}
                  style={{height:600,marginBottom:50}}
                  />
        </Card>
        
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
