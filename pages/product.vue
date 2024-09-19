<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">商品列表</h1>
      <button class="btn btn-primary" @click="showAddProductForm = true">新增產品</button>
    </div>

    <div v-if="showAddProductForm">
      <h2>新增產品</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="productName" class="form-label">產品名稱</label>
          <input type="text" class="form-control" id="productName" v-model="productName" placeholder="產品名稱（25-100字）" required>
        </div>

        <div class="mb-3">
          <label for="gtin" class="form-label">GTIN</label>
          <input type="text" class="form-control" id="gtin" v-model="gtin" placeholder="輸入GTIN" required>
        </div>

        <div class="mb-3">
          <label for="category" class="form-label">類別</label>
          <select class="form-select" id="category" v-model="category" required>
            <option selected disabled>選擇產品類別</option>
            <option value="1">類別1</option>
            <option value="2">類別2</option>
            <option value="3">類別3</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">商品詳細說明</label>
          <textarea class="form-control" id="description" v-model="description" rows="3" placeholder="輸入產品詳細說明" required></textarea>
        </div>

        <h2>商品規格</h2>
        <table class="table">
          <thead>
            <tr>
              <th>規格名稱</th>
              <th>價格</th>
              <th>商品數量</th>
              <th>規格圖片</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(spec, index) in specifications" :key="index">
              <td>
                <input type="text" class="form-control" v-model="spec.name" placeholder="輸入規格名稱" required>
              </td>
              <td>
                <input type="number" class="form-control" v-model="spec.price" placeholder="輸入價格" required min="0">
              </td>
              <td>
                <input type="number" class="form-control" v-model="spec.quantity" placeholder="輸入商品數量" required min="1">
              </td>
              <td>
                <input type="file" class="form-control" accept="image/*" @change="(event) => previewSpecImage(event, index)" />
              </td>
              <td>
                <button type="button" class="btn btn-danger btn-sm" @click="removeSpecification(index)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="btn btn-secondary" @click="addSpecification">新增規格</button>

        <h2>商品圖片</h2>
        <div class="mb-3">
          <label class="form-label">1:1比例圖片 (最多9張)</label>
          <input type="file" class="form-control" accept="image/*" multiple @change="previewImages" />
          <small class="form-text text-muted">行片會用於行頁、尋結頁、每日新現頁。</small>
          <div class="image-preview d-flex flex-wrap mt-2" v-if="imagePreviews.length">
            <div v-for="(image, index) in imagePreviews" :key="index" class="image-preview-item">
              <img :src="image" alt="預覽圖片" />
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between">
          <button type="submit" class="btn btn-primary" :disabled="!isFormValid">送出</button>
          <button type="button" class="btn btn-outline-secondary" @click="showAddProductForm = false">返回商品列表</button>
        </div>
      </form>
    </div>

    <div v-else>
      <h2>當前商品列表</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>產品名稱</th>
            <th>GTIN</th>
            <th>類別</th>
            <th>規格</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>{{ product.name }}</td>
            <td>{{ product.gtin }}</td>
            <td>{{ product.category }}</td>
            <td>
              <ul>
                <li v-for="(spec, specIndex) in product.specifications" :key="specIndex">
                  {{ spec.name }} - 價格: {{ spec.price }} - 數量: {{ spec.quantity }}
                </li>
              </ul>
            </td>
            <td>
              <button class="btn btn-warning btn-sm" @click="editProduct(index)">修改</button>
              <button class="btn btn-danger btn-sm" @click="deleteProduct(index)">刪除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'back-layout'
})
import { ref, computed } from 'vue';

const imagePreviews = ref<string[]>([]);
const showAddProductForm = ref(false);
const productName = ref('');
const gtin = ref('');
const category = ref('');
const description = ref('');
const specifications = ref([{ name: '', price: 0, quantity: 1, image: '' }]); // 存儲規格
const products = ref<any[]>([]); // 存儲商品列表

const isFormValid = computed(() => {
  return productName.value && gtin.value && category.value && description.value && specifications.every(spec => spec.name && spec.price >= 0 && spec.quantity > 0);
});

function addSpecification() {
  specifications.value.push({ name: '', price: 0, quantity: 1, image: '' });
}

function removeSpecification(index: number) {
  specifications.value.splice(index, 1);
}

function previewSpecImage(event: Event, index: number) {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    const imageUrl = URL.createObjectURL(files[0]);
    specifications.value[index].image = imageUrl; // 保存圖片的URL
  }
}

function previewImages(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    imagePreviews.value = Array.from(files).map(file => URL.createObjectURL(file));
  }
}

function submitForm() {
  // 檢查是否有輸入
  if (!isFormValid.value) {
    return; // 若無效，則不提交
  }

  // 添加新商品到列表
  products.value.push({
    name: productName.value,
    gtin: gtin.value,
    category: category.value,
    description: description.value,
    specifications: specifications.value,
  });
  
  // 提交後返回商品列表
  showAddProductForm.value = false;
  resetForm();
}

function editProduct(index: number) {
  // 編輯商品邏輯（可以根據需要實現）
  alert(`編輯商品: ${products.value[index].name}`);
}

function deleteProduct(index: number) {
  // 刪除商品
  products.value.splice(index, 1);
}

function resetForm() {
  productName.value = '';
  gtin.value = '';
  category.value = '';
  description.value = '';
  specifications.value = [{ name: '', price: 0, quantity: 1, image: '' }];
  imagePreviews.value = [];
}
</script>

<style scoped>
.image-preview {
  display: flex;
  flex-wrap: wrap;
}
.image-preview-item {
  width: 100px; /* 調整為所需的縮圖大小 */
  height: 100px; /* 確保為正方形 */
  margin: 5px;
  overflow: hidden;
}
.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 確保圖片覆蓋整個區域 */
}
.table th, .table td {
  vertical-align: middle;
}
.btn-primary:disabled {
  background-color: #ccc;
  border-color: #ccc;
}
</style>
