<template>
  <div v-if="row.children.length > 0">
      <Row v-for="item in row.children" :key="item.id" type="flex" align="middle">
          <Col span="5">
            <Tag style="box-shadow: 0 0 10px #fff;text-shadow: 0 0 5px #fff;">{{item.authName}}</Tag>
            <Icon type="md-arrow-dropright" />
          </Col>
          <Col span="19" v-if="item.children.length > 0">
            <Row v-for="subItem in item.children" :key="subItem.id"  type="flex" align="middle" class="middleRow">
                <Col span="8">
                    <Tag style="box-shadow: 0 0 5px #fff;">{{subItem.authName}}</Tag>
                    <Icon type="md-arrow-dropright" />
                </Col>
                <Col span="16">
                    <Tag v-for="miniItem in subItem.children" :key="miniItem.id" closable @on-close="deleteRight(miniItem)">{{miniItem.authName}}</Tag>
                </Col>
            </Row>
          </Col>
      </Row>
  </div>
</template>

<script>
import { deleteRoleRight } from '../../api/role.js'
export default {
  props: {
    row: Object
  },
  methods: {
    deleteRight (info) {
      this.$Modal.confirm({
        title: '删除操作',
        content: `<p>确认删除${info.authName}吗？</p>`,
        onOk: async () => {
          const { data: res } = await deleteRoleRight(this.row.id, info.id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.row.children = res.data
        },
        onCancel: () => {
          this.$message.info('已取消删除')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-row-flex {
    border-bottom: 1px solid #fff;
    padding: 10px 0;
}
.ivu-row-flex:first-child {
    border-top: 1px solid #fff;
}
.middleRow:first-child {
    border-top: 0;
}
.middleRow:last-child {
    border-bottom: 0;
}
.ivu-tag {
    margin: 7px;
    .ivu-icon-ios-close {
        color: #fff;
    }
}
</style>
