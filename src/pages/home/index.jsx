import {
  Avatar,
  Card,
  Col,
  List,
  Skeleton,
  Row,
  Statistic,
  Button,
  Progress,
  Badge,
  Radio,
  Icon,
  Descriptions,
  Modal,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import '../../../node_modules/video-react/dist/video-react.css';
import styles from './style.less';
const { confirm } = Modal;

const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.name}
          ，祝你开心每一天！
        </div>
        <div>
          大家好，我叫{currentUser.name}
          {/* {currentUser.title} |{currentUser.group} */}
        </div>
      </div>
    </div>
  );
};

@connect(({ user: { userInfo, rankUsers } }) => ({
  userInfo,
  rankUsers,
}))
class Workplace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MediaStream: null,
      statusType: 'all',
      gradeStatus: 0, //0所有，1同级
      punchStatus: 2, //0离线，1在线，2所有
      curPage: 1,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
  }
  ListContent = user => (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>状态</span>
        <p>
          <Badge status={user.punch ? 'success' : 'default'} />
          <span>{user.punch ? '打卡中' : '未打卡'}</span>
        </p>
      </div>
      <div className={styles.listContentItem}>
        <span>本周打卡</span>
        <p>{user.weekTime}h</p>
      </div>
      <div className={styles.listContentItem}>
        <span>今日打卡</span>
        <p>{user.todayTime}h</p>
      </div>
      <div className={styles.listContentItem}>
        <div>打卡完成进度</div>
        <Progress
          percent={+((+user.weekTime / 28) * 100).toFixed(2)}
          strokeWidth={6}
          style={{
            width: 180,
          }}
        />
      </div>
    </div>
  );

  renderActivities = (item, index) => {
    return (
      <List.Item key={index}>
        <Row style={{ width: '100%' }}>
          <Col style={{ textAlign: 'center', height: '100%' }} span={1}>
            <span style={{ fontSize: 17 }}>{item.rank}</span>
          </Col>
          <Col span={6}>
            <List.Item.Meta
              style={{}}
              avatar={<Avatar src={item.avatar} />}
              title={
                <span>
                  <a className={styles.username}>{item.name}</a>
                </span>
              }
              description={
                <span className={styles.datetime} title={item.updatedAt}>
                  {item.grade}级
                </span>
              }
            />
          </Col>
          <Col span={17}>{this.ListContent(item)}</Col>
        </Row>
      </List.Item>
    );
  };

  handleGradeStatusChange = e => {
    this.setState({
      gradeStatus: e.target.value,
    });
  };
  handlePunchStatusChange = e => {
    this.setState({
      punchStatus: e.target.value,
    });
  };
  startPunch = () => {
    const { dispatch, userInfo } = this.props;
    if (userInfo.punch) {
      Modal.success({
        title: '您正在打卡中',
        content: `本次已打卡${userInfo.unfinishTime.h}hour ${userInfo.unfinishTime.m}min`,
      });
    } else
      dispatch({
        type: 'home/startPunch',
        payload: { studentID: userInfo.studentID },
      });
  };

  endPunch = () => {
    const { dispatch, userInfo } = this.props;
    if (!userInfo.punch) {
      Modal.warning({
        title: `${userInfo.name}未开始打卡！`,
        content: '请先开始打卡',
      });
    } else if (userInfo.unfinishTime.h * 60 + userInfo.unfinishTime.m < 30) {
      confirm({
        title: '你本次打卡未达到30分钟，确认结束?',
        content: '结束打卡本次记录将无效',
        cancelText: '取消',
        okText: '确定',
        onOk() {
          dispatch({
            type: 'home/endPunch',
            payload: { studentID: userInfo.studentID },
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      dispatch({
        type: 'home/endPunch',
        payload: { studentID: userInfo.studentID },
      });
    }
  };
  handleChangePage = page => {
    this.setState({
      curPage: page,
    });
  };
  render() {
    const { userInfo, rankUsers } = this.props;
    const { gradeStatus, punchStatus, curPage } = this.state;
    let filterStudents = rankUsers
      .filter(item => {
        return gradeStatus === 0 || userInfo.grade === item.grade;
      })
      .filter(
        item =>
          punchStatus === 2 ||
          (punchStatus === 1 && item.punch) ||
          (punchStatus === 0 && !item.punch),
      ).map((item,index)=>{
        return {...item,rank:index+1}
      })
      let rankedUsers = rankUsers.map((item,index)=>{
        return {...item,rank:index+1}
      })
    const headStatus = (
      <span>
        <span>状态 : </span>

        <Badge status={userInfo.punch ? 'success' : 'default'} />
        <span>{userInfo.punch ? '打卡中' : '未打卡'}</span>
      </span>
    );
    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <Statistic title="本周打卡" value={userInfo.weekTime} suffix="h" />
        </div>
        <div className={styles.statItem}>
          <Statistic title="团队内排名" value={userInfo.rank} suffix={`/ ${rankUsers.length}`} />
        </div>
        <div className={styles.statItem}>
          <Statistic title="今日打卡" value={userInfo.todayTime} suffix="h" />
        </div>
      </div>
    );
    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={userInfo} />}
        extra={headStatus}
        extraContent={extraContent}
        breadcrumb={{
          routes: [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            {
              path: '/',
              breadcrumbName: 'home',
            },
          ],
        }}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{
                padding: 0,
              }}
              bordered={false}
              className={styles.activeCard}
              title={
                <div>
                  <Icon type="flag" style={{ marginRight: 15 }} />
                  <span>本周打卡榜</span>
                </div>
              }
              extra={
                <div>
                  <div className={styles.salesCardExtra}>
                    <div className={styles.salesTypeRadio}>
                      <Radio.Group
                        value={this.state.gradeStatus}
                        style={{ marginRight: 20 }}
                        onChange={this.handleGradeStatusChange}
                      >
                        <Radio.Button value={0}>全部</Radio.Button>
                        <Radio.Button value={1}>同级</Radio.Button>
                      </Radio.Group>
                      <Radio.Group
                        value={this.state.punchStatus}
                        onChange={this.handlePunchStatusChange}
                      >
                        <Radio.Button value={2}>全部</Radio.Button>
                        <Radio.Button value={1}>打卡中</Radio.Button>
                        <Radio.Button value={0}>离线</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
              }
            >
              <List
                renderItem={(item, index) => this.renderActivities(item, index)}
                dataSource={
                  gradeStatus === 0 && punchStatus === 2 ? rankedUsers : filterStudents
                }
                className={styles.activitiesList}
                size="large"
                pagination={{
                  onChange: page => {
                    console.log(page);
                  },
                  size:'small',
                  pageSize: 8,
                }}
                
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{
                marginBottom: 24,
              }}
              title="打卡面板"
              bordered={false}
              bodyStyle={{
                padding: 0,
              }}
            >
              <div>
                <Button
                  style={{ margin: '15px 0 12px 22px' }}
                  onClick={this.startPunch}
                  type="primary"
                >
                  开始打卡
                </Button>
                <Button style={{ marginLeft: 15, marginTop: 15 }} onClick={this.endPunch}>
                  停止打卡
                </Button>

                <Descriptions column={2} style={{ marginLeft: 22 }}>
                  <Descriptions.Item label="本周打卡">
                    <Statistic value={userInfo.weekTime} suffix="h" />
                  </Descriptions.Item>
                  <Descriptions.Item label="今日打卡">{userInfo.todayTime}h</Descriptions.Item>
                  <Descriptions.Item label="剩余打卡时间">
                    {userInfo.weekLeftTime}h
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Badge status={userInfo.punch ? 'processing' : 'default'}></Badge>
                    {userInfo.punch ? '打卡中' : '未打卡'}
                  </Descriptions.Item>
                  <Descriptions.Item label="本次已打卡">{`${userInfo.unfinishTime.h}hour ${userInfo.unfinishTime.m}min`}</Descriptions.Item>
                </Descriptions>
              </div>
            </Card>
            <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              title="公告"
            >
              <div className={styles.chart}></div>
            </Card>
            <Card
              bodyStyle={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
              bordered={false}
              title="团队"
            >
              <div className={styles.members}>
                <Row gutter={48}></Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
