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
    text: ''
  };

  
  handleChange = (value) => {
    this.setState({ text: value })
  }
  render() {
    const { form,detail } = this.props;
    const { getFieldDecorator } = form;
    
    const title = <div>
      <span>{detail.title}</span>
    </div>
    const extra = <div>
      <Button type='primary' onClick={()=>{this.props.history.goBack()}}>返回</Button>
    </div>
    const cardExtra = <span>
      发布日期 : {moment(detail.publishTime).format('YYYY-MM-DD HH:mm')}
    </span>
    return (
      <PageHeaderWrapper
      extra={extra}
      
      >
        <Card
          title={title}
          extra={cardExtra}
        >
          <div dangerouslySetInnerHTML={{__html:detail.content}}>

          </div>
          
          
        </Card>
        
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
