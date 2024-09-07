<script setup la
  components: { sidebar },ng="ts">
import sidebar from '../components/sidebar.vue';



</script>


<template>

    <back-header/>

    <div class="container-fluid">

        <div class="row">

            <sidebar/>

            <NuxtPage/>

        </div>
    
    </div>

</template>


<style scoped>



</style>