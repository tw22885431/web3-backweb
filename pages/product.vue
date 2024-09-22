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
          <select class="form-select" id="category" v-model="categoryId" required>
            <option selected disabled>選擇產品類別</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
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
                <input type="file" class="form-control" accept="image/*" @change="(event) => handleFileChange(event, index)">
              </td>
              <td>
                <button type="button" class="btn btn-danger" @click="removeSpecification(index)">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" class="btn btn-secondary" @click="addSpecification">新增規格</button>
        <button type="submit" class="btn btn-success">提交</button>
      </form>
    </div>
  </main>
</template>

<script>
const supabase = useSupabaseClient();

export default {
  definePageMeta() {
    return {
      layout: 'back-layout'
    };
  },
  data() {
    return {
      showAddProductForm: false,
      productName: '',
      gtin: '',
      categoryId: null,
      description: '',
      specifications: [{ name: '', price: null, quantity: null }],
      categories: [] // 用來儲存類別資料
    };
  },
  methods: {
    async fetchCategories() {
      let { data: categories, error } = await supabase
			.from('categories').select('*');


      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        this.categories = data;
      }
    },
    async submitForm() {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: this.productName,
            gtin: this.gtin,
            category_id: this.categoryId,
            description: this.description,
            specifications: this.specifications,
            images: [] // 可以根據需要添加圖片資料
          }
        ]).select();

      if (error) {
        console.error('Error inserting product:', error);
      } else {
        console.log('Product inserted:', data);
        // 清空表單或進行其他操作
        this.resetForm();
      }
    },
    handleFileChange(event, index) {
      // 處理檔案變更的邏輯
      const file = event.target.files[0];
      // 可以在這裡進行上傳或其他處理
    },
    removeSpecification(index) {
      this.specifications.splice(index, 1);
    },
    addSpecification() {
      this.specifications.push({ name: '', price: null, quantity: null });
    },
    resetForm() {
      this.productName = '';
      this.gtin = '';
      this.categoryId = null;
      this.description = '';
      this.specifications = [{ name: '', price: null, quantity: null }];
      this.showAddProductForm = false;
    }
  },
  mounted() {
    this.fetchCategories();
  }
};
</script>

<style scoped>
/* 您可以在這裡添加樣式 */
</style>
