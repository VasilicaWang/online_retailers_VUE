<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">订单管理</BreadcrumbItem>
      <BreadcrumbItem>订单列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Row slot="title" class="header">
        <Col span="6">
          <Input placeholder="输入搜索内容" clearable v-model="paramsInfo.query" @on-clear="getOrderList">
            <Button slot="append" icon="ios-search" @click="getOrderList"></Button>
          </Input>
        </Col>
      </Row>
      <Table :columns="columns" :data="orderList" disabled-hover border>
        <template slot="isSend" slot-scope="{row}">
          <Tag v-if="row.is_send === '否'" style="box-shadow: 0 0 10px #fff;">未付款</Tag>
          <Tag v-else>已付款</Tag>
        </template>
        <template slot="createTime" slot-scope="{row}">
          {{row.create_time | formatDate}}
        </template>
        <template slot="opt" slot-scope="{row}">
          <Button @click="showEditModal(row)" icon="ios-brush-outline"></Button>&nbsp;
          <Button @click="showProgressModal" icon="ios-locate-outline"></Button>
        </template>
      </Table>
    </Card>
    <!-- 修改地址模态框 -->
    <Modal
      v-model="editAddressModal"
      type="primary"  title="修改地址"
      @on-ok="editAddress"
      >
      <Form ref="editAddressData" :model="editAddressData" :rules="formRules" :label-width="100">
        <FormItem label="省市区/县" prop="address1">
          <Cascader :value="editAddressData.address1" :data="citydata" trigger="hover"></Cascader>
        </FormItem>
        <FormItem label="详细地址" prop="address2">
          <Input v-model="editAddressData.address2" placeholder="请输入用户名"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 查看物流模态框 -->
    <Modal
      v-model="progressModal"
      type="primary"  title="物流状态"
      >
      <Timeline>
        <TimelineItem v-for="(item, index) in progressData" :key="index">
          <p class="time">{{item.time}}</p>
          <p class="content">{{item.context}}</p>
        </TimelineItem>
      </Timeline>
    </Modal>
  </div>
</template>

<script>
import { getOrder, viewProgress } from '../../api/order.js'
import citydata from './citydata.js'
export default {
  data () {
    return {
      paramsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      columns: [
        {
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '订单编号',
          key: 'order_number',
          align: 'center'
        },
        {
          title: '订单价格',
          key: 'order_price',
          width: 120,
          align: 'center'
        },
        {
          title: '是否付款',
          slot: 'isSend',
          width: 200,
          align: 'center'
        },
        {
          title: '下单时间',
          slot: 'createTime',
          width: 220,
          align: 'center'
        },
        {
          title: '操作',
          slot: 'opt',
          align: 'center',
          width: 160
        }
      ],
      orderList: [],
      total: 0,
      editAddressModal: false,
      editAddressData: {
        address1: [],
        address2: ''
      },
      formRules: {
        address1: [
          { required: true, message: '请选择地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      citydata,
      progressModal: false,
      progressData: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await getOrder(this.paramsInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.orderList = res.data.goods
      this.total = res.data.total
      // console.log(this.orderList)
    },
    showEditModal (row) {
      console.log(row)
      this.editAddressModal = true
    },
    editAddress () {
      this.$message.success('修改成功')
    },
    showProgressModal () {
      this.progressModal = true
      this.getProgress()
    },
    // 获取物流信息
    async getProgress () {
      const { data: res } = await viewProgress()
      if (res.meta.status !== 200) return this.$message.error(res.meta.message)
      this.$message.success(res.meta.message)
      this.progressData = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
