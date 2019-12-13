<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">用户管理</BreadcrumbItem>
      <BreadcrumbItem>用户列表</BreadcrumbItem>
    </Breadcrumb>
    <!-- 卡片 -->
    <Card :bordered="false">
      <Row :gutter="16" slot="title" class="header">
        <Col span="6">
          <Input placeholder="搜索用户" clearable v-model="paramsInfo.query" @on-clear="getUserList">
            <Button slot="append" icon="ios-search" @click="getUserList"></Button>
          </Input>
        </Col>
        <Col span="6">
            <Button @click="addUserModal = true">添加用户</Button>
        </Col>
      </Row>
      <Table class="userTable" :columns="columns" :data="usersList" disabled-hover border>
        <template slot-scope="{ row }" slot="mgState">
          <Switchbutton @on-change="switchState(row)" true-color="rgba(255,255,255,.85)" false-color="rgba(255,255,255,.1)" :value="row.mg_state" />
        </template>
        <template slot-scope="{ row }" slot="setting">
          <Button @click="showEditMoal(row)" ghost icon="ios-brush-outline"></Button>
          <Button @click="confirmDeleteUser(row)" ghost icon="ios-trash-outline"></Button>
          <Button @click="showChangeRole(row)" ghost icon="ios-settings-outline"></Button>
        </template>
      </Table>
      <!-- 分页 -->
      <Page :total="total" size="small" :current="paramsInfo.pagenum" :page-size="paramsInfo.pagesize" :page-size-opts="[2, 3, 5, 10]" @on-change="handleNumChange" @on-page-size-change="handleSizeChange" show-total show-elevator show-sizer />
      <!-- 添加用户模态框 -->
      <Modal
        v-model="addUserModal"
       type="primary"  title="添加用户"
        @on-ok="addForm"
        @on-cancel="cancelAdd">
        <Form ref="addFormData" :model="addFormData" :rules="formRules" :label-width="80">
          <FormItem label="用户名" prop="username">
            <Input v-model="addFormData.username" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input type="password" v-model="addFormData.password" placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="addFormData.email" placeholder="请输入邮箱"></Input>
          </FormItem>
          <FormItem label="手机" prop="mobile">
            <Input v-model="addFormData.mobile" placeholder="请输入手机号"></Input>
          </FormItem>
        </Form>
      </Modal>
      <!-- 编辑用户模态框 -->
      <Modal
        v-model="editUserModal"
       type="primary"  title="添加用户"
        @on-ok="editForm"
        @on-cancel="cancelEdit">
        <Form ref="editFormData" :model="editFormData" :rules="formRules" :label-width="80">
          <FormItem label="用户名" prop="username">
            <Input disabled v-model="editFormData.username" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="邮箱" prop="email">
            <Input v-model="editFormData.email" placeholder="请输入邮箱"></Input>
          </FormItem>
          <FormItem label="手机" prop="mobile">
            <Input v-model="editFormData.mobile" placeholder="请输入手机号"></Input>
          </FormItem>
        </Form>
      </Modal>
      <!-- 更改用户角色模态框 -->
      <Modal
        v-model="changRoleModal"
       type="primary"  title="更改用户角色"
        @on-ok="changeRole"
        @on-cancel="calcelRole">
        <p style="margin-bottom: 10px">当前的用户：{{roleUser.username}}</p>
        <p style="margin-bottom: 10px">当前的角色：{{roleUser.role_name}}</p>
        <p>请选择角色：
          <Select v-model="roleId" style="width:200px">
            <Option v-for="item in rolesList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
          </Select>
        </p>
      </Modal>
    </Card>
  </div>
</template>

<script>
import { getUser, addUser, changeState, editUser, deleteUser, changeUserRole } from '../../api/users'
import { getRoles } from '../../api/role.js'
export default {
  data () {
    // 验证邮箱
    const emailValid = (rule, value, callback) => {
      let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (emailReg.test(value) || value.length === 0) {
        callback()
      } else {
        callback(new Error('邮箱格式不符合规则'))
      }
    }
    // 验证手机号
    const mobileValid = (rule, value, callback) => {
      let mobileReg = /^[1]([3-9])[0-9]{9}$/
      if (mobileReg.test(value) || value.length === 0) {
        callback()
      } else {
        callback(new Error('手机号格式不符合规则'))
      }
    }
    return {
      paramsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      // 表格数据配置
      columns: [
        {
          type: 'index',
          width: '50px'
        },
        {
          title: '用户名',
          key: 'username',
          width: '120px'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '电话',
          key: 'mobile'
        },
        {
          title: '角色',
          key: 'role_name'
        },
        {
          title: '状态',
          slot: 'mgState',
          width: '120px'
        },
        {
          title: '操作',
          slot: 'setting',
          width: '200px',
          align: 'center'
        }
      ],
      usersList: [],
      total: 0,
      addUserModal: false,
      // 添加用户表单数据
      addFormData: {
        username: 'test',
        password: '123456',
        email: '',
        mobile: ''
      },
      // 表单验证
      formRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名应在2到10位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '密码应在6到16位', trigger: 'blur' }
        ],
        email: [
          { validator: emailValid, trigger: 'blur' }
        ],
        mobile: [
          { validator: mobileValid, trigger: 'blur' }
        ]
      },
      editUserModal: false,
      // 修改用户信息表单数据
      editFormData: {},
      changRoleModal: false,
      roleUser: {},
      roleId: '',
      rolesList: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await getUser(this.paramsInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.usersList = res.data.users
      this.total = res.data.total
      // console.log(this.usersList)
    },
    // 点击页码切换用户列表
    handleNumChange (val) {
      this.paramsInfo.pagenum = val
      this.getUserList()
    },
    // 设置每页显示条数
    handleSizeChange (val) {
      this.paramsInfo.pagesize = val
      this.getUserList()
    },
    // 添加用户
    addForm () {
      this.$refs.addFormData.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        const { data: res } = await addUser(this.addFormData)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUserList()
      })
    },
    // 取消添加
    cancelAdd () {
      this.$refs.addFormData.resetFields()
    },
    // 更改用户状态
    async switchState (row) {
      console.log(row.mg_state)
      // switch触发返回的是当前的状态，不是改变后的
      const { data: res } = await changeState(row.id, !row.mg_state)
      // console.log(res.data.mg_state)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 显示修改用户模态框
    showEditMoal (row) {
      this.editUserModal = true
      this.editFormData = row
    },
    // 取消修改
    cancelEdit () {
      this.editFormData = {}
      this.$refs.editFormData.resetFields()
    },
    // 修改用户
    editForm () {
      this.$refs.editFormData.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        // console.log(this.editFormData)
        const { data: res } = await editUser(this.editFormData.id, { email: this.editFormData.email, mobile: this.editFormData.mobile })
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUserList()
      })
    },
    // 删除用户
    confirmDeleteUser (row) {
      this.$Modal.confirm({
        title: '删除操作',
        content: `<p>确认删除${row.username}吗？</p>`,
        onOk: async () => {
          const { data: res } = await deleteUser(row.id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getUserList()
        },
        onCancel: () => {
          this.$message.info('已取消删除')
        }
      })
    },
    // 显示更改用户角色模态框
    showChangeRole (row) {
      this.changRoleModal = true
      this.roleUser = row
      this.getRoleList()
    },
    // 获取角色列表
    async getRoleList () {
      const { data: res } = await getRoles()
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rolesList = res.data
    },
    // 更改用户角色
    async changeRole () {
      const { data: res } = await changeUserRole(this.roleUser.id, this.roleId)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    calcelRole () {}
  }
}
</script>

<style lang="less" scoped>
.ivu-button {
  margin: 0 4px !important;
}
</style>
