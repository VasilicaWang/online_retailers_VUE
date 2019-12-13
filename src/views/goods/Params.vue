<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">商品管理</BreadcrumbItem>
      <BreadcrumbItem>分类参数</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Row slot="title">
        <Alert show-icon type="warning">注意！只允许为第三级分类设置相关参数</Alert>
        <div>
          请选择商品分类：<Cascader ref="cascaderClear" :data="catList" trigger="hover" @on-change="getCateId"></Cascader>
        </div>
      </Row>
      <Tabs :value="activeName" @on-click="toggleTab">
        <TabPane label="动态参数" name="many" icon="md-basketball" :disabled="isDisabled">
          <Button :disabled="isDisabled">添加参数</Button>
          <Table :data="manyTableData" :columns="manyColumns">
            <template slot="vals" slot-scope="{row}">
              <Tag v-for="(item, i) in row.attr_vals" :key="i">{{item}}</Tag>
            </template>
            <template slot="opt">
              <Button icon="ios-brush-outline"></Button>&nbsp;
              <Button icon="ios-trash-outline"></Button>
            </template>
          </Table>
        </TabPane>
        <TabPane label="静态属性" name="only" icon="md-beer" :disabled="isDisabled">
          <Button :disabled="isDisabled">添加属性</Button>
          <Table :data="onlyTableData" :columns="onlyColumns">
            <template slot="vals" slot-scope="{row}">
              <Tag v-for="(item, i) in row.attr_vals" :key="i">{{item}}</Tag>
            </template>
            <template slot="opt">
              <Button icon="ios-brush-outline"></Button>&nbsp;
              <Button icon="ios-trash-outline"></Button>
            </template>
          </Table>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { getCate } from '../../api/cate.js'
import { getParams } from '../../api/param.js'

export default {
  data () {
    return {
      catList: [],
      selectedCate: [],
      manyTableData: [],
      onlyTableData: [],
      activeName: 'many',
      manyColumns: [
        {
          type: 'index',
          width: 60
        }, {
          title: '参数名称',
          key: 'attr_name',
          width: 160
        }, {
          title: '参数分类信息',
          slot: 'vals'
        }, {
          title: '操作',
          slot: 'opt',
          width: 200,
          align: 'center'
        }
      ],
      onlyColumns: [
        {
          type: 'index',
          width: 60
        }, {
          title: '参数名称',
          key: 'attr_name',
          width: 200
        }, {
          title: '参数分类信息',
          slot: 'vals'
        }, {
          title: '操作',
          slot: 'opt',
          width: 200,
          align: 'center'
        }
      ]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await getCate()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.addLabel(res.data)
      this.catList = res.data
    },
    addLabel (arr) {
      arr.forEach(item => {
        item.label = item.cat_name
        item.children && this.addLabel(item.children)
      })
    },
    async getCateId (val, selectedData) {
      if (selectedData.length !== 3) {
        this.$refs.cascaderClear.clearSelect()
        return false
      }
      // console.log(selectedData)
      this.selectedCate = selectedData
      this.getParamsData()
    },
    async getParamsData () {
      const { data: res } = await getParams(this.catId, this.activeName)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(',')
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
        console.log('many', this.manyTableData)
      } else {
        this.onlyTableData = res.data
        console.log('only', this.onlyTableData)
      }
    },
    toggleTab () {
      console.log(this.activeName)
      if (this.activeName === 'many') {
        this.activeName = 'only'
      } else {
        this.activeName = 'many'
      }
      this.getParamsData()
    }
  },
  computed: {
    catId () {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2].cat_id
      }
      return null
    },
    isDisabled () {
      if (this.selectedCate.length !== 3) {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-alert {
  background: rgba(100,100,100,.3);
  border-color: #999;
  margin-bottom: 20px;
}
.ivu-cascader {
  display: inline-block;
  width: 300px
}
</style>
