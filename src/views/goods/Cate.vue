<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb separator="/">
      <BreadcrumbItem to="/">主页</BreadcrumbItem>
      <BreadcrumbItem to="/components/breadcrumb">商品管理</BreadcrumbItem>
      <BreadcrumbItem>商品分类</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Row style="margin-bottom: 20px">
        <Button @click="showAddCateModal">添加分类</Button>
      </Row>
      <tree-table :data="catesList" :columns="columns" :selection-type="false" :show-index="true" :expand-type="false" :show-row-hover="false" border>
        <template slot="isOk" slot-scope="{row}">
          <Icon v-if="!row.cat_deleted" type="ios-checkmark-circle-outline" />
          <Icon v-else type="ios-close-circle-outline" />
        </template>
        <template slot="level" slot-scope="{row}">
          <Tag v-if="row.cat_level === 0" style="box-shadow: 0 0 10px #fff;">一级</Tag>
          <Tag v-else-if="row.cat_level === 1" style="box-shadow: 0 0 3px #fff;">二级</Tag>
          <Tag v-else>三级</Tag>
        </template>
        <template slot="opt" slot-scope="{row}">
          <Button @click="showEditCateModal(row)" icon="ios-brush-outline">编辑</Button>&nbsp;&nbsp;
          <Button @click="deleteCateById(row)" icon="ios-trash-outline">删除</Button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <Page :total="total" size="small" :current="paramsInfo.pagenum" :page-size="paramsInfo.pagesize" :page-size-opts="[2, 3, 5, 10]" @on-change="handleNumChange" @on-page-size-change="handleSizeChange" show-total show-elevator show-sizer />
    </Card>
    <!-- 添加分类模态框 -->
    <Modal
      v-model="addCateModal"
      type="primary"  title="添加分类"
      @on-ok="confirmAddCate"
      @on-cancel="cancelAdd">
      <Form ref="addFormData" :model="addFormData" :rules="formRules" :label-width="80">
        <FormItem label="分类名称" prop="cat_name">
          <Input v-model="addFormData.cat_name" placeholder="请输入分类名称"></Input>
        </FormItem>
        <FormItem label="父级分类">
          <Cascader ref="cascaderClear" :data="fullCateList" trigger="click" @on-change="getPid" :change-on-select="true"></Cascader>
        </FormItem>
      </Form>
    </Modal>
    <!-- 编辑分类 -->
    <Modal
      v-model="editCateModal"
      type="primary"  title="编辑分类"
      @on-ok="confirmeditCate">
      <Form ref="editFormData" :model="editFormData" :rules="formRules" :label-width="80">
        <FormItem label="分类名称" prop="cat_name">
          <Input v-model="editFormData.cat_name" placeholder="请输入分类名称"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getCate, addCate, deleteCate, editCate } from '../../api/cate.js'
export default {
  data () {
    return {
      paramsInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catesList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOk'
        }, {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'level'
        }, {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateModal: false,
      addFormData: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      formRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      fullCateList: [],
      editCateModal: false,
      editFormData: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await getCate(this.paramsInfo)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catesList = res.data.result
      this.total = res.data.total
      // console.log(this.catesList)
    },
    handleNumChange (val) {
      this.paramsInfo.pagenum = val
      this.getCateList()
    },
    handleSizeChange (val) {
      this.paramsInfo.pagesize = val
      this.getCateList()
    },
    showAddCateModal () {
      this.getFullCate()
      this.addCateModal = true
    },
    async getFullCate () {
      const { data: res } = await getCate({ type: 2 })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.addLabel(res.data)
      this.fullCateList = res.data
    },
    // 同时点击同一级时只会触发第一次的事件
    getPid (value, selectedData) {
      if (selectedData.length > 0) {
        this.addFormData.cat_pid = selectedData[selectedData.length - 1].cat_id
        this.addFormData.cat_level = selectedData[selectedData.length - 1].cat_level + 1
      }
    },
    confirmAddCate () {
      this.$refs.addFormData.validate(async valid => {
        if (!valid) return this.$message.error('验证失败')
        const { data: res } = await addCate(this.addFormData)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addCateModal = false
        this.addFormData.cat_name = ''
        this.addFormData.cat_pid = 0
        this.addFormData.cat_level = 0
        this.$refs.cascaderClear.clearSelect()
      })
    },
    cancelAdd () {
      this.$refs.addFormData.resetFields()
    },
    // 添加label标签递归
    addLabel (arr) {
      arr.forEach(item => {
        item.label = item.cat_name
        item.children && this.addLabel(item.children)
      })
    },
    deleteCateById (row) {
      console.log(row)
      this.$Modal.confirm({
        title: '删除操作',
        content: `<p>确认删除此分类吗？</p>`,
        onOk: async () => {
          const { data: res } = await deleteCate(row.cat_id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getCateList()
        },
        onCancel: () => {
          this.$message.info('已取消删除')
        }
      })
    },
    showEditCateModal (row) {
      this.editFormData = row
      this.editCateModal = true
    },
    async confirmeditCate () {
      const { data: res } = await editCate(this.editFormData.cat_id, this.editFormData.cat_name)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  background-color: transparent;
  color: #fff;
}
</style>
