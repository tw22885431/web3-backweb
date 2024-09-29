<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">商品列表</h1>
      <button class="btn btn-primary" @click="showAddProductForm = true">新增產品</button>
    </div>

    <div v-if="showAddProductForm" class="card mb-4">
      <div class="card-header">
        <h2>新增產品</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitProductForm">
          <div class="mb-3">
            <label for="productName" class="form-label">產品名稱</label>
            <input type="text" class="form-control" id="productName" v-model="productName" placeholder="產品名稱（25-100字）" required>
          </div>

          <div class="mb-3">
            <label for="gtin" class="form-label">GTIN</label>
            <input type="text" class="form-control" id="gtin" v-model="gtin" placeholder="輸入GTIN" required>
          </div>

          <!-- 類別選擇 -->
          <div class="mb-3">
            <label for="categories" class="form-label">類別選擇</label>
            <div>
              <p class="mt-2">選擇的類別: {{ getSelectedCategories() }}</p>
              <button type="button" class="btn btn-secondary" @click="openCategorySelector">選擇類別</button>
            </div>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">商品詳細說明</label>
            <textarea class="form-control" id="description" v-model="description" rows="3" placeholder="輸入產品詳細說明" required></textarea>
          </div>

          <h2 class="mt-4">商品規格</h2>
          <table class="table table-striped">
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
    </div>

    <!-- 類別選擇視窗 -->
    <div v-if="showCategorySelector" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">選擇類別</h5>
            <button type="button" class="btn-close" @click="closeCategorySelector"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4">
                <h5>大類別</h5>
                <ul class="list-group">
                  <li class="list-group-item" v-for="category in mainCategories" :key="category.id" @click="selectMainCategory(category)">
                    <span :class="{'text-primary': selectedMainCategoryId === category.id}">{{ category.name }}</span>
                  </li>
                  <li class="list-group-item">
                    <button class="btn btn-primary w-100" @click="showAddCategoryModal('main')">新增大類別</button>
                  </li>
                </ul>
              </div>
              <div class="col-md-4" v-if="selectedMainCategoryId">
                <h5>中類別</h5>
                <ul class="list-group">
                  <li class="list-group-item" v-for="subcategory in subcategories" :key="subcategory.id" @click="selectSubcategory(subcategory)">
                    <span :class="{'text-primary': selectedSubcategoryId === subcategory.id}">{{ subcategory.name }}</span>
                  </li>
                  <li class="list-group-item">
                    <button class="btn btn-primary w-100" @click="showAddCategoryModal('sub')">新增中類別</button>
                  </li>
                </ul>
              </div>
              <div class="col-md-4" v-if="selectedSubcategoryId">
                <h5>小類別</h5>
                <ul class="list-group">
                  <li class="list-group-item" v-for="subSubcategory in subSubcategories" :key="subSubcategory.id" @click="selectSubSubcategory(subSubcategory)">
                    <span :class="{'text-primary': selectedSubSubcategoryId === subSubcategory.id}">{{ subSubcategory.name }}</span>
                  </li>
                  <li class="list-group-item">
                    <button class="btn btn-primary w-100" @click="showAddCategoryModal('subSub')">新增小類別</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" @click="confirmCategorySelection">完成</button>
            <button type="button" class="btn btn-secondary" @click="closeCategorySelector">取消</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增類別 Modal -->
    <div v-if="isAddCategoryModalVisible" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">新增類別</h5>
            <button type="button" class="btn-close" @click="isAddCategoryModalVisible = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitCategoryForm">
              <div class="mb-3">
                <label for="categoryName" class="form-label">類別名稱</label>
                <input type="text" class="form-control" id="categoryName" v-model="newCategoryName" placeholder="輸入類別名稱" required>
              </div>
              <div class="mb-3" v-if="categoryType === 'sub' || categoryType === 'subSub'">
                <label for="parentCategory" class="form-label">父類別</label>
                <select class="form-select" v-model="parentCategoryId" required>
                  <option selected disabled>選擇父類別</option>
                  <option v-for="category in (categoryType === 'sub' ? mainCategories : subcategories)" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">新增類別</button>
              <button type="button" class="btn btn-secondary" @click="isAddCategoryModalVisible = false">取消</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// 添加頁面元數據
definePageMeta({
  layout: 'back-layout'
});
import { ref, onMounted } from 'vue';

const supabase = useSupabaseClient();

const showAddProductForm = ref(false);
const showCategorySelector = ref(false);
const isAddCategoryModalVisible = ref(false);
const productName = ref('');
const gtin = ref('');
const description = ref('');
const specifications = ref([{ name: '', price: null, quantity: null }]);
const mainCategories = ref([]);
const subcategories = ref([]);
const subSubcategories = ref([]);
const selectedMainCategoryId = ref(null);
const selectedSubcategoryId = ref(null);
const selectedSubSubcategoryId = ref(null);
const newCategoryName = ref('');
const parentCategoryId = ref(null);
const categoryType = ref('');

// 獲取大類別
const fetchMainCategories = async () => {
  const { data, error } = await supabase.from('categories').select('*').is('parent_id', null);
  if (error) {
    console.error('Error fetching main categories:', error);
  } else {
    mainCategories.value = data;
  }
};

// 獲取中類別
const fetchSubcategories = async () => {
  if (selectedMainCategoryId.value) {
    const { data, error } = await supabase.from('categories').select('*').eq('parent_id', selectedMainCategoryId.value);
    if (error) {
      console.error('Error fetching subcategories:', error);
    } else {
      subcategories.value = data;
    }
  }
};

// 獲取小類別
const fetchSubSubcategories = async () => {
  if (selectedSubcategoryId.value) {
    const { data, error } = await supabase.from('categories').select('*').eq('parent_id', selectedSubcategoryId.value);
    if (error) {
      console.error('Error fetching sub-subcategories:', error);
    } else {
      subSubcategories.value = data;
    }
  }
};

// 顯示類別選擇器
const openCategorySelector = () => {
  showCategorySelector.value = true;
};

// 關閉類別選擇器
const closeCategorySelector = () => {
  showCategorySelector.value = false;
  // 清空選擇
  selectedMainCategoryId.value = null;
  selectedSubcategoryId.value = null;
  selectedSubSubcategoryId.value = null;
};

// 確認選擇的類別
const confirmCategorySelection = () => {
  showCategorySelector.value = false; // 關閉選擇視窗
};

// 選擇大類別
const selectMainCategory = (category) => {
  selectedMainCategoryId.value = category.id;
  fetchSubcategories();
  selectedSubcategoryId.value = null; // 重置中類別
  selectedSubSubcategoryId.value = null; // 重置小類別
};

// 選擇中類別
const selectSubcategory = (subcategory) => {
  selectedSubcategoryId.value = subcategory.id;
  fetchSubSubcategories();
  selectedSubSubcategoryId.value = null; // 重置小類別
};

// 選擇小類別
const selectSubSubcategory = (subSubcategory) => {
  selectedSubSubcategoryId.value = subSubcategory.id;
};

// 顯示新增類別的模態框
const showAddCategoryModal = (type) => {
  categoryType.value = type;
  isAddCategoryModalVisible.value = true;
};

// 提交新增類別表單
const submitCategoryForm = async () => {
  const payload = {
    name: newCategoryName.value,
    parent_id: parentCategoryId.value || null,
  };

  const { data, error } = await supabase.from('categories').insert([payload]);
  if (error) {
    console.error('Error adding category:', error);
  } else {
    isAddCategoryModalVisible.value = false;
    if (categoryType.value === 'main') {
      fetchMainCategories();
    } else if (categoryType.value === 'sub') {
      fetchSubcategories();
    } else if (categoryType.value === 'subSub') {
      fetchSubSubcategories();
    }
  }
};

// 提交新增產品表單
const submitProductForm = async () => {
  const payload = {
    name: productName.value,
    gtin: gtin.value,
    description: description.value,
    specifications: specifications.value,
    category_id: selectedSubSubcategoryId.value || selectedSubcategoryId.value,
  };

  const { data, error } = await supabase.from('products').insert([payload]);
  if (error) {
    console.error('Error adding product:', error);
  } else {
    showAddProductForm.value = false;
  }
};

// 當前組件掛載時獲取大類別
onMounted(() => {
  fetchMainCategories();
});

// 新增規格
const addSpecification = () => {
  specifications.value.push({ name: '', price: null, quantity: null });
};

// 刪除規格
const removeSpecification = (index) => {
  specifications.value.splice(index, 1);
};

// 處理文件變更
const handleFileChange = (event, index) => {
  const file = event.target.files[0];
  specifications.value[index].image = file;
};

// 獲取選擇的類別字串
const getSelectedCategories = () => {
  const mainCategory = selectedMainCategoryId.value ? mainCategories.value.find(cat => cat.id === selectedMainCategoryId.value)?.name : null;
  const subCategory = selectedSubcategoryId.value ? subcategories.value.find(cat => cat.id === selectedSubcategoryId.value)?.name : null;
  const subSubCategory = selectedSubSubcategoryId.value ? subSubcategories.value.find(cat => cat.id === selectedSubSubcategoryId.value)?.name : null;

  const categories = [mainCategory, subCategory, subSubCategory].filter(Boolean);

  return categories.length > 0 ? categories.join(' > ') : '';
};
</script>

<style scoped>
.text-primary {
  color: blue; /* 可以根據需要更改顏色 */
}
.text-secondary {
  color: gray; /* 可以根據需要更改顏色 */
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
