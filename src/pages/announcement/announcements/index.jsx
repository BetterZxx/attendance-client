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
  Descriptions,
  Popconfirm
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = [, 'processing','default', 'success', 'error'];
const status = [,'已发布','未发布'];

/* eslint react/no-multi-comp:0 */
@connect(({  loading,announcement }) => ({

  loading: loading.models.listTableList,
  announcements:announcement.data
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    detailModalVisible:false
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    // {
    //   title: '发布人',
    //   dataIndex: 'desc',
    // },
    {
      title: '发布日期',
      dataIndex: 'publishTime',
      render: val => {
        return moment(val).format('YYYY-MM-DD HH:mm')
      },
      // mark to display a total number
    },
    
    {
      title: '状态',
      dataIndex: 'status',
      render:(val) => {
        return <span>
          <Badge status={statusMap[val]} text={status[val]} />
        </span>;
      },
    },
    
    {
      title: '操作',
      width:'200px',
      dataIndex:'id',
      render: (id) => (
        <Fragment>
          <a onClick={()=>this.handleView(id)}>查看公告</a>
           <Divider type="vertical" />
           <a onClick={()=>this.handleModify(id)}>修改</a>
           <Divider type="vertical" />
           <Popconfirm placement="topLeft" title={`确认删除该公告?`} onConfirm={()=>this.handleDelete(id)} okText="确认" cancelText="取消">
              <a style={{color:'red'}}>删除</a>
          </Popconfirm>
           
          
        </Fragment>
      ),
    },
  ];
  handleDelete = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'announcement/delete',
      payload:{
          announcementId:id
      }
    })

  }
  handleView = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'announcement/getDetail',
      payload:{
        announcementId:id
      }
    })
    this.props.history.push('/manage/announcement/detail')
  }
  handleModify = (id)=>{
    const {dispatch} = this.props
    dispatch({
      type:'announcement/updateIsModify',
      payload:true
    })
    dispatch({
      type:'announcement/getDetail',
      payload:{
        announcementId:id
      }
    })
    this.props.history.push('/manage/announcement/append')
  }
  editWarning = ()=>{
    Modal.warning({
      title: '提醒',
      content: '编辑申请表会导致审核重新开始',
      okText:'知道了',
      onOk:()=>{this.props.history.push('/tproject/manage/edit')}
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'announcement/fetch',
    });
  }
 

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'listTableList/fetch',
      payload: {},
    });
  };

  
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'listTableList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;

      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleFilter = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      let startTime = fieldsValue.date[0].format('x')
      let endTime = fieldsValue.date[1].format('x')
      const values = {
        ...fieldsValue,startTime,endTime
      };
      delete values.date
      console.log(values)
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'announcement/filter',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="公告标题">
              {getFieldDecorator('title')(
                <Input placeholder='标题'></Input>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value={1}>已发布</Option>
                  <Option value={2}>待发布</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('date')(
                <RangePicker
                  style={{
                    width: '100%',
                  }}
                  
                />
              )}
            </FormItem>
          </Col>
          
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  hideModal = ()=>{
    this.setState({
      modalVisible:false
    })
  }
  showModal = ()=>{
    this.setState({
      modalVisible:true
    })
  }
  showDetailModal = ()=>{
    this.setState({
      detailModalVisible:true
    })
  }
  hideDetailModal = ()=>{
    this.setState({
      detailModalVisible:false
    })
  }
  handleAppend = ()=>{
    const {dispatch} = this.props
    dispatch({
      type:'announcement/updateIsModify',
      payload:false
    })
    this.props.history.push('/manage/announcement/append')

  }
  render() {
    const {
      loading,
      announcements
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,detailModalVisible } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">撤回</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card 
        bordered={false}
        >
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAppend }>
                新建公告
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button type='primary'>发布</Button>
                  <Button>删除</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            
            {/* <span style={{float:'right'}} className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleFilter}>
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span> */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              dataSource={announcements}
              rowKey={(item,index)=>index}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
         
          {/* <CreateForm {...parentMethods} modalVisible={modalVisible} />
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null} */}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
