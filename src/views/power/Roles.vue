<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">权限管理</BreadcrumbItem>
      <BreadcrumbItem>角色列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Row style="margin-bottom: 20px">
        <Col><Button @click="showAddRole" size="large">添加角色</Button></Col>
      </Row>
      <Table disabled-hover :columns="columns" :data="rolesList" border>
        <template slot="opt" slot-scope="{row}">
          <Button @click="showEditRole(row)" icon="ios-brush-outline">编辑</Button>
          <Button @click="deleteRoles(row)" icon="ios-trash-outline">删除</Button>
          <Button @click="showEditRight(row)" icon="ios-settings-outline">分配权限</Button>
        </template>
      </Table>
    </Card>
    <!-- 添加角色模态框 -->
    <Modal
      v-model="addRoleVisible"
      title="添加角色"
      @on-ok="addRoles"
      @on-cancel="addCancel">
      <Form ref="addRoleData" :model="addRoleData" :rules="formRules" :label-width="80">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="addRoleData.roleName" placeholder="输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色描述" prop="roleDesc">
          <Input v-model="addRoleData.roleDesc" placeholder="输入角色描述"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 编辑角色模态框 -->
    <Modal
      v-model="editRoleVisible"
      title="编辑角色"
      @on-ok="editRoles" @on-cancel="editCancel">
      <Form ref="editRoleData" :model="editRoleData" :rules="formRules" :label-width="80">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="editRoleData.roleName" placeholder="输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色描述" prop="roleDesc">
          <Input v-model="editRoleData.roleDesc" placeholder="输入角色描述"></Input>
        </FormItem>
      </Form>
    </Modal>
    <!-- 分配权限树形控件 -->
    <Modal
      v-model="editRightVisible"
      title="分配权限"
      @on-ok="editRight" @on-cancel="editRightCancel">
      <Tree ref="tree" :data="rightsList" show-checkbox @on-check-change="getCheckedId"></Tree>
    </Modal>
  </div>
</template>

<script>
import { getRoles, addRole, editRole, deleteRole, allocationRight } from '../../api/role.js'
import { getRightsTree } from '../../api/rights.js'
import expandRow from './RolesExpandRow.vue'
export default {
  data () {
    return {
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        }, {
          type: 'index',
          width: 80
        }, {
          title: '角色名称',
          key: 'roleName',
          width: 200
        }, {
          title: '角色描述',
          key: 'roleDesc'
        }, {
          title: '操作',
          slot: 'opt',
          width: '330px'
        }
      ],
      rolesList: [],
      addRoleVisible: false,
      addRoleData: {
        roleName: '',
        roleDesc: ''
      },
      formRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleDesc: [
          { max: 20, message: '角色描述长度不能多余20个字符', trigger: 'blur' }
        ]
      },
      editRoleVisible: false,
      editRoleData: {},
      editRightVisible: false,
      rightsList: [],
      roleId: '',
      selectedKeys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await getRoles()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.rolesList = res.data
    },
    showAddRole () {
      this.addRoleVisible = true
    },
    async addRoles () {
      const { data: res } = await addRole(this.addRoleData)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
    },
    addCancel () {
      this.$refs.addRoleData.resetFields()
    },
    showEditRole (row) {
      this.editRoleVisible = true
      this.editRoleData = row
    },
    async editRoles () {
      const { data: res } = await editRole(this.editRoleData.id, { roleName: this.editRoleData.roleName, roleDesc: this.editRoleData.roleDesc })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('修改成功')
      this.getRolesList()
    },
    deleteRoles (row) {
      this.$Modal.confirm({
        title: '删除操作',
        content: `<p>确认删除${row.roleName}这个角色吗？</p>`,
        onOk: async () => {
          const { data: res } = await deleteRole(row.id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getRolesList()
        },
        onCancel: () => {
          this.$message.info('已取消删除')
        }
      })
    },
    editCancel () {
      this.$refs.editRoleData.resetFields()
      this.getRolesList()
    },
    async showEditRight (row) {
      const { data: res } = await getRightsTree()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRightVisible = true
      this.roleId = row.id
      this.rightsList = res.data
      let selectedId = []
      row.children && row.children.forEach(item => {
        item.children && item.children.forEach(subItem => {
          subItem.children && subItem.children.forEach(miniItem => {
            selectedId.push(miniItem.id)
          })
        })
      })
      this.addTitle(this.rightsList, selectedId)
    },
    getCheckedId () {
      const checkedList = this.$refs.tree.getCheckedAndIndeterminateNodes()
      checkedList && checkedList.forEach(item => {
        if (this.selectedKeys && this.selectedKeys.indexOf(item.id) === -1) {
          this.selectedKeys.push(item.id)
        }
      })
    },
    async editRight () {
      const { data: res } = await allocationRight(this.roleId, this.selectedKeys.join(','))
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.selectedKeys = []
      this.getRolesList()
    },
    editRightCancel () {
      this.selectedKeys = []
    },
    // 为所有权限添加title属性
    addTitle (data, idArr) {
      data.forEach(item => {
        item.title = item.authName
        item.expand = true
        if (idArr && idArr.indexOf(item.id) !== -1) {
          item.checked = true
        }
        if (item.children) {
          this.addTitle(item.children, idArr)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
