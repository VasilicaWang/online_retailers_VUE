<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/avatar.jpg" alt />
      </div>
      <div class="loginForm">
        <Form ref="formValidate" :model="LoginFormData" :rules="loginFormRules">
          <FormItem prop="username">
            <Input type="text" v-model="LoginFormData.username" prefix="ios-contact" size="large" />
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="LoginFormData.password" prefix="ios-lock" size="large" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="onSubmit">登 录</Button>&nbsp;
            <Button type="primary" @click="handleReset('formValidate')">重 置</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../api/login'
export default {
  data () {
    return {
      LoginFormData: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { type: 'string', min: 3, max: 10, message: '用户名应为 3 到 10 位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, max: 16, message: '密码长度应为 6 到 16 位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      const { data: res } = await login(this.LoginFormData)
      if (res.meta.status !== 200) {
        return this.$message.error({
          background: true,
          content: '登录失败' })
      }
      this.$message.success({
        background: true,
        content: '登录成功' })
      window.sessionStorage.setItem('token', res.data.token)
      this.$router.push('/')
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: url("../assets/img/bg (5).jpg") no-repeat center;
}
.login_box {
  width: 400px;
  height: 300px;
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #fff;
  background-color: rgb(255, 255, 255);
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    border-radius: 50%;
  }
}
.loginForm {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  .ivu-form-item {
    margin-bottom: 24px;
    .ivu-btn {
      color: #fff;
    }
    &:nth-child(3) {
      display: flex;
      justify-content: flex-end;
      button {
        outline: none;
        border: 0;
      }
    }
  }
}
</style>
