<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">权限管理</BreadcrumbItem>
      <BreadcrumbItem>权限列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Table :columns="columns" :data="rightsList" border>
        <template slot="levelTag" slot-scope="{row}">
          <Tag v-if="row.level === '0'" color="#000000cc" style="box-shadow: 0 0 15px #fff;text-shadow: 0 0 10px #fff;">一级</Tag>
          <Tag v-else-if="row.level === '1'" color="#00000080" style="box-shadow: 0 0 5px #fff;text-shadow: 0 0 5px #fff;">二级</Tag>
          <Tag v-else color="#0000004d">三级</Tag>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
import { getRights } from '../../api/rights.js'
export default {
  data () {
    return {
      columns: [
        {
          type: 'index',
          width: '80px'
        }, {
          title: '权限名称',
          key: 'authName'
        }, {
          title: '路径',
          key: 'path'
        }, {
          title: '权限等级',
          key: 'level',
          slot: 'levelTag'
        }
      ],
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await getRights()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      console.log(res)
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
div {
  color: #0000004d
}
</style>
