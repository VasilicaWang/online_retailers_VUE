<template>
  <div class="layout">
    <Layout>
      <Header>
        <div>
          <img src="../assets/img/logo(1).png" alt />
          <span>后台操作系统</span>
        </div>
        <Button type="info" @click="logout">退 出</Button>
      </Header>
      <Layout>
        <Sider collapsible :collapsed-width="53" v-model="isCollapsed">
          <Menu accordion width="auto">
            <Submenu :name="item.id" v-for="(item, index) in menuList" :key="item.id">
              <template slot="title">
                <i :class="iconList[index]"></i>
                <span>{{item.authName}}</span>
                <em class="mask"></em>
              </template>
              <MenuItem
                :name="subItem.id"
                v-for="subItem in item.children"
                :key="subItem.id"
                :to="'/'+subItem.path"
              >{{subItem.authName}}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Content :style="{padding: '10px 20px'}">
          <router-view></router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { getMenu } from '../api/home'
export default {
  data () {
    return {
      menuList: [],
      iconList: [
        'iconfont icon-users',
        'iconfont icon-lifangtilitiduomiantifangkuai2',
        'iconfont icon-shangpingouwudai2',
        'iconfont icon-danju-tianchong',
        'iconfont icon-baobiao'
      ],
      isCollapsed: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await getMenu()
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error({
          background: true,
          content: res.meta.msg
        })
      }
      this.menuList = res.data
    }
  },
  computed: {
    menuitemClasses: function () {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-layout {
  background: url("../assets/img/bg (4).jpg") no-repeat center;
  background-size: cover;
}
.layout,
.ivu-layout {
  height: 100%;
}
.ivu-layout-header {
  background-color: rgba(0, 0, 0, 0.8);
  padding-left: 0;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ivu-btn {
    background-color: #666;
    border: 0;
    text-shadow: 0 0 5px #fff;
    color: #fff;
  }
  > div {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 20px;
    letter-spacing: 2px;
    font-weight: 700;
    img {
      height: 120%;
      margin-right: 10px;
    }
  }
}
.ivu-layout-sider {
  background-color: rgba(34, 34, 34, 0.9);
  height: 100%;
  .ivu-menu {
    color: #fff;
    background-color: #222;
    white-space: nowrap;
    overflow: hidden;
    .ivu-menu-submenu {
      width: 200px;
    }
    .ivu-menu-item {
      color: #eee;
      padding-left: 60px !important;
    }
    .iconfont {
      margin-right: 15px;
    }
    .mask {
      position: absolute;
      top: 15px;
      right: 25px;
      width: 20px;
      height: 20px;
      background-color: #222;
      z-index: 9;
    }
  }
}
.ivu-layout-sider .ivu-menu .ivu-menu-submenu .ivu-menu-submenu-title i,
.ivu-layout-sider .ivu-menu .ivu-menu-submenu .ivu-menu-submenu-title span {
  transition: all 0.2s ease-in-out;
}
.ivu-layout-sider .ivu-menu .ivu-menu-submenu .ivu-menu-submenu-title:hover i,
.ivu-layout-sider
  .ivu-menu
  .ivu-menu-submenu
  .ivu-menu-submenu-title:hover
  span {
  color: #fff !important;
  text-shadow: 0 0 10px #fff;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background-color: #000;
  color: #fff;
  border: 0;
  text-shadow: 0 0 5px #fff;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu)::after {
  width: 0;
}
.ivu-menu-vertical.ivu-menu-light:after {
  width: 0;
}
.ivu-layout-content {
  .ivu-card {
    background-color: rgba(102, 102, 102, 0.8);
    color: #fff;
  }
}
</style>
