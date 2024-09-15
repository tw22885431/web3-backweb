<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">產品資訊</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-secondary">取消</button>
        <button type="button" class="btn btn-sm btn-primary">保存並上架</button>
      </div>
    </div>

    <form>
      <div class="mb-3">
        <label for="productName" class="form-label">產品名稱</label>
        <input type="text" class="form-control" id="productName" placeholder="輸入產品名稱" required>
      </div>

      <div class="mb-3">
        <label for="images" class="form-label">上傳圖片 (至少 3 張)</label>
        <input type="file" class="form-control" id="images" multiple required>
      </div>

      <div class="mb-3">
        <label for="gtin" class="form-label">GTIN</label>
        <input type="text" class="form-control" id="gtin" placeholder="輸入GTIN" required>
      </div>

      <div class="mb-3">
        <label for="category" class="form-label">類別</label>
        <select class="form-select" id="category" required>
          <option selected disabled>選擇產品類別</option>
          <option value="1">類別1</option>
          <option value="2">類別2</option>
          <option value="3">類別3</option>
        </select>
      </div>

      <h2 class="mt-4">銷售資訊</h2>
      <div class="mb-3">
        <label for="saleInfo" class="form-label">銷售資訊描述</label>
        <textarea class="form-control" id="saleInfo" rows="3" placeholder="輸入銷售資訊" required></textarea>
      </div>

      <h2 class="mt-4">其他資訊</h2>
      <div class="mb-3">
        <label for="otherInfo" class="form-label">其他資訊描述</label>
        <textarea class="form-control" id="otherInfo" rows="3" placeholder="輸入其他資訊"></textarea>
      </div>

      <div class="d-flex justify-content-between">
        <button type="submit" class="btn btn-primary">保存並上架</button>
        <button type="button" class="btn btn-secondary" @click="resetForm">重置</button>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'back-layout'
})
function resetForm() {
  const form = document.querySelector('form');
  if (form) {
    form.reset();
  }
}
</script>

<style scoped>
/* 自定義樣式 */
h2 {
  font-weight: bold;
  color: #333;
}

.form-label {
  font-weight: 600;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #e9ecef;
}
</style>
