<template>
  <div class="accountSecurity">
    <account-security :isAlready="isAlready"></account-security>
  </div>
</template>

<script>
  import accountSecurity from "../../../../components/accountSecurity/accountSecurity";

  export default {
    data() {
      return {
        isAlready: false
      };
    },
    methods: {},
    components: {
      accountSecurity
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/_commonScss";
  .accountSecurity {
    min-height: 460px;
    padding: 4px 20px;
    background: #ffffff;
    box-shadow: $base-box-shadow;
    margin-bottom: 100px;
  }
</style>
