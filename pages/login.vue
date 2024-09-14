<template>
  


 <main class="form-signin">
  <form>

    <h1 class="h3 mb-3 fw-normal">鳥巢比特商店後台</h1>

    <div class="form-floating">
      <input type="username" class="form-control" id="floatingInput" >
      <label for="floatingInput">帳號</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" >
      <label for="floatingPassword">密碼</label>
    </div>

    
    <button class="w-100 btn btn-lg btn-primary" type="submit">登入</button>

  </form>
</main>


</template>

<script setup>
useHead({
  bodyAttrs: {
    class: "text-center"
  },
});


</script>

<style scoped>

  @import url("~/assets/css/signin.css");

</style>