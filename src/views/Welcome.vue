<template>
  <div class="welcome_container">
    <img src="../assets/img/welcome.png" alt />
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.welcome_container {
  height: 100%;
  background: url("../assets/img/bg (10).jpg") no-repeat center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 5px;
  img {
    width: 50%;
  }
}
</style>
