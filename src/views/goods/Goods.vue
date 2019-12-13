<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">商品管理</BreadcrumbItem>
      <BreadcrumbItem>商品列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Row slot="title">
        <Col span="6">
          <Input placeholder="搜索商品" clearable v-model="paramsInfo.query" @on-clear="getGoodsList">
            <Button slot="append" icon="ios-search" @click="getGoodsList"></Button>
          </Input>
        </Col>
      </Row>
      <Table border :columns="columns" :data="goodsList">
        <template slot="addTime" slot-scope="{row}">
          {{row.add_time | formatDate}}
        </template>
        <template slot="opt">
          <Button icon="ios-brush-outline"></Button>&nbsp;&nbsp;
          <Button icon="ios-trash-outline"></Button>
        </template>
      </Table>
      <Page :total="total" size="small" :current="paramsInfo.pagenum" :page-size="paramsInfo.pagesize" :page-size-opts="[3, 5, 10, 20]" @on-change="handleNumChange" @on-page-size-change="handleSizeChange" show-total show-elevator show-sizer />
    </Card>
  </div>
</template>

<script>
import { getGoods } from '../../api/goods.js'
export default {
  data () {
    return {
      paramsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0,
      columns: [
        {
          type: 'index',
          width: 70
        }, {
          title: '商品名称',
          key: 'goods_name'
        }, {
          title: '商品价格',
          key: 'goods_price',
          width: 100
        }, {
          title: '商品重量',
          key: 'goods_weight',
          width: 100
        }, {
          title: '创建时间',
          slot: 'addTime',
          width: 200
        }, {
          title: '操作',
          width: 120,
          slot: 'opt',
          align: 'center'
        }
      ]
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await getGoods(this.paramsInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    handleNumChange (val) {
      this.paramsInfo.pagenum = val
      this.getGoodsList()
    },
    handleSizeChange (val) {
      this.paramsInfo.pagesize = val
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
