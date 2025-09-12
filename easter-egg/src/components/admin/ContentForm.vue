<template>
  <div class="form-overlay">
    <div class="form-modal" @click.stop>
      <div class="form-header">
        <h2>{{ isEdit ? '编辑' : '添加' }}{{ contentTypeText }}</h2>
        <button class="close-button" @click="$emit('close')">×</button>

      </div>
      
      <form @submit.prevent="handleSubmit" class="content-form">
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="title">标题 *</label>
              <input
                id="title"
                v-model="formData.title"
                type="text"
                required
                placeholder="请输入标题"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="description">描述 *</label>
              <textarea
                id="description"
                v-model="formData.description"
                required
                placeholder="请输入描述"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="publish_date">发布日期</label>
              <input
                id="publish_date"
                v-model="formData.publish_date"
                type="date"
              />
            </div>
            
            <div class="form-group">
              <label for="address_bar">地址栏标识 *</label>
              <input
                id="address_bar"
                v-model="formData.address_bar"
                type="text"
                :required="!isEdit"
                :readonly="isEdit"
                :placeholder="isEdit ? '地址栏标识（不可编辑）' : '请输入地址栏标识'"
                :class="{ 'readonly-field': isEdit }"
              />
              <small v-if="isEdit" class="form-help readonly-help">
                地址栏标识在编辑模式下不可修改
              </small>
            </div>
          </div>
        </div>
        
        <!-- 显示设置 -->
        <div class="form-section">
          <h3 class="section-title">显示设置</h3>
          
          <div class="form-row" v-if="contentType !== 'news'">
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input
                  v-model="formData.is_latest"
                  type="checkbox"
                />
                <span class="checkmark"></span>
                显示在首页Latest Discoveries板块
              </label>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input
                  v-model="formData.is_home"
                  type="checkbox"
                />
                <span class="checkmark"></span>
                显示在首页{{ contentTypeText }}板块
              </label>
            </div>
          </div>
        </div>
        
        <!-- 分类设置 -->
        <div class="form-section" v-if="contentType !== 'news'">
          <h3 class="section-title">分类设置</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="classify">分类标签</label>
              <div class="category-selector">
                <select 
                  v-model="selectedCategory" 
                  @change="addCategory"
                  class="category-dropdown"
                >
                  <option value="">请选择分类</option>
                  <option 
                    v-for="category in availableCategories" 
                    :key="category.id" 
                    :value="category.name"
                  >
                    {{ category.display_name }}
                  </option>
                </select>
                <button type="button" class="add-category-btn" @click="addCategory">+</button>
              </div>
              <div class="tags-container" v-if="Array.isArray(formData.classify) && formData.classify.length > 0">
                <span 
                  v-for="(tag, index) in formData.classify" 
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                  <button type="button" @click="removeTag(index)" class="remove-tag" :title="`删除标签: ${tag}`">×</button>
                </span>
              </div>
              <div class="category-help">
                已选择 {{ Array.isArray(formData.classify) ? formData.classify.length : 0 }} 个分类标签
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="label">标签按钮</label>
              <div class="category-selector">
                <input
                  v-model="newLabel"
                  type="text"
                  placeholder="输入标签名称，按回车或点击+添加"
                  @keyup.enter="addLabel"
                  class="category-dropdown"
                />
                <button type="button" class="add-category-btn" @click="addLabel">+</button>
              </div>
              <div class="tags-container" v-if="Array.isArray(formData.label) && formData.label.length > 0">
                <span 
                  v-for="(tag, index) in formData.label" 
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                  <button type="button" @click="removeLabel(index)" class="remove-tag" :title="`删除标签: ${tag}`">×</button>
                </span>
              </div>
              <div class="category-help">
                已添加 {{ Array.isArray(formData.label) ? formData.label.length : 0 }} 个标签按钮
              </div>
            </div>
          </div>
        </div>
        
        <!-- 媒体设置 -->
        <div class="form-section">
          <h3 class="section-title">媒体设置</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="image_url">图片URL</label>
              <input
                id="image_url"
                v-model="formData.image_url"
                type="text"
                placeholder="请输入图片URL，如：/images/game.jpg"
              />
            </div>
            
            <div class="form-group">
              <label for="image_alt">图片描述</label>
              <input
                id="image_alt"
                v-model="formData.image_alt"
                type="text"
                placeholder="请输入图片描述"
              />
            </div>
          </div>
          
          <div class="form-row" v-if="contentType !== 'news'">
            <div class="form-group">
              <label for="iframe_url">视频URL(https://www.youtube.com/embed/your-video-id)</label>
              <input
                id="iframe_url"
                v-model="formData.iframe_url"
                type="text"
                placeholder="请输入视频URL"
              />
            </div>
          </div>
        </div>
        
        <!-- SEO设置 -->
        <div class="form-section">
          <h3 class="section-title">SEO设置</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="seo_title">SEO标题</label>
              <input
                id="seo_title"
                v-model="formData.seo_title"
                type="text"
                placeholder="请输入SEO标题"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="seo_description">SEO描述</label>
              <textarea
                id="seo_description"
                v-model="formData.seo_description"
                placeholder="请输入SEO描述"
                rows="2"
              ></textarea>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="seo_keywords">SEO关键词</label>
              <input
                id="seo_keywords"
                v-model="formData.seo_keywords"
                type="text"
                placeholder="请输入SEO关键词，用逗号分隔"
              />
            </div>
          </div>
        </div>
        
        <!-- 内容详情 -->
        <div class="form-section">
          <h3 class="section-title">内容详情</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="details_html">HTML内容</label>
              <textarea
                id="details_html"
                v-model="formData.details_html"
                placeholder="请输入HTML内容，支持v-html渲染"
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- 表单操作 -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            取消
          </button>
                        <button type="submit" class="btn btn-primary" :disabled="props.isSubmitting">
                {{ props.isSubmitting ? '上传中...' : (isEdit ? '更新' : '创建') }}
              </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { categoriesApi } from '@/services/api.js'

const props = defineProps({
  contentType: {
    type: String,
    required: true
  },
  editData: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

// 表单数据
const formData = ref({
  title: '',
  description: '',
  publish_date: '',
  is_latest: false,
  is_home: false,
  label: [],
  classify: [],
  image_url: '',
  image_alt: '',
  address_bar: '',
  iframe_url: '',
  seo_title: '',
  seo_description: '',
  seo_keywords: '',
  details_html: ''
})

// 分类相关
const availableCategories = ref([])
const selectedCategory = ref('')
const newLabel = ref('')

// 计算属性
const isEdit = computed(() => !!props.editData)
const contentTypeText = computed(() => {
  const textMap = {
    game: '游戏',
    movie: '电影',
    tv: '电视剧',
    news: '新闻'
  }
  return textMap[props.contentType] || '内容'
})

// 初始化表单数据
const initFormData = () => {
  if (props.editData) {
    // 编辑模式，填充现有数据
    
    // 为新闻管理过滤掉不需要的字段
    if (props.contentType === 'news') {
      const { is_latest, classify, iframe_url, ...filteredData } = props.editData
      formData.value = filteredData
    } else {
      formData.value = { ...props.editData }
      
      // 确保label字段是数组
      if (!formData.value.label) {
        formData.value.label = []
      } else if (!Array.isArray(formData.value.label)) {
        // 如果仍然是字符串（向后兼容），转换为数组
        formData.value.label = [formData.value.label]
      }
      
      // 确保classify字段是数组
      if (formData.value.classify && !Array.isArray(formData.value.classify)) {
        formData.value.classify = [formData.value.classify]
      } else if (!formData.value.classify) {
        formData.value.classify = []
      }
    }
  } else {
    // 添加模式，设置默认值
    const today = new Date().toISOString().split('T')[0]
    formData.value = {
      title: '',
      description: '',
      publish_date: today,
      is_latest: props.contentType !== 'news' ? false : null,
      is_home: false,
      label: [props.contentType.toUpperCase()],
      classify: props.contentType !== 'news' ? [] : null,
      image_url: '',
      image_alt: '',
      address_bar: '',
      iframe_url: props.contentType !== 'news' ? '' : null,
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      details_html: ''
    }
  }
}

// 添加分类
const addCategory = () => {
  if (props.contentType === 'news') return // 新闻管理禁用分类功能
  
  const category = selectedCategory.value.trim()
  if (category && !formData.value.classify.includes(category)) {
    formData.value.classify.push(category)
    selectedCategory.value = '' // 重置选择器
  }
}

// 获取可用分类
const fetchCategories = async () => {
  if (props.contentType === 'news') return // 新闻不需要分类
  
  try {
    const response = await categoriesApi.getByMediaType(props.contentType)
    if (response.success) {
      availableCategories.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 移除标签
const removeTag = (index) => {
  if (props.contentType === 'news') return // 新闻管理禁用标签功能
  
  formData.value.classify.splice(index, 1)
}

// 添加标签按钮
const addLabel = () => {
  if (props.contentType === 'news') return // 新闻管理禁用标签功能
  
  const label = newLabel.value.trim()
  if (label) {
    // 确保label是数组
    if (!Array.isArray(formData.value.label)) {
      formData.value.label = []
    }
    
    if (!formData.value.label.includes(label)) {
      formData.value.label.push(label)
      newLabel.value = '' // 重置输入框
    }
  }
}

// 移除标签按钮
const removeLabel = (index) => {
  if (props.contentType === 'news') return // 新闻管理禁用标签功能
  
  // 确保label是数组
  if (Array.isArray(formData.value.label)) {
    formData.value.label.splice(index, 1)
  }
}

// 处理表单提交
const handleSubmit = async () => {
  // 验证必填字段
  if (!formData.value.title || !formData.value.description) {
    alert('请填写必填字段')
    return
  }
  
  if (!isEdit.value && !formData.value.address_bar) {
    alert('请填写地址栏标识')
    return
  }
  
  // 为新闻管理过滤掉不需要的字段
  let dataToSave = { ...formData.value }
  
  if (props.contentType === 'news') {
    // 移除新闻管理不需要的字段
    delete dataToSave.is_latest
    delete dataToSave.classify
    delete dataToSave.iframe_url
  }
  
  // 发送保存事件，让父组件处理
  emit('save', dataToSave)
}


// 监听编辑数据变化
watch(() => props.editData, initFormData, { immediate: true })

// 监听分类更新事件
const handleCategoriesUpdate = (event) => {
  fetchCategories()
  
  // 如果是编辑分类，需要同步更新已添加的分类标签
  if (event.detail && event.detail.action === 'update' && event.detail.category) {
    updateExistingClassifyTags(event.detail.category)
  }
}

// 更新已添加的分类标签名称
const updateExistingClassifyTags = (updatedCategory) => {
  if (!formData.value.classify || !Array.isArray(formData.value.classify)) {
    return
  }
  
  // 查找并更新匹配的分类标签
  const updatedClassify = formData.value.classify.map(tag => {
    // 如果当前标签匹配更新前的分类名称，则更新为新名称
    if (tag === updatedCategory.oldName) {
      return updatedCategory.name
    }
    return tag
  })
  
  // 更新表单数据
  formData.value.classify = updatedClassify
}

// 组件挂载时初始化
onMounted(() => {
  initFormData()
  fetchCategories()
  // 监听分类更新事件
  window.addEventListener('categories-updated', handleCategoriesUpdate)
})

// 组件卸载时清理事件监听器
onUnmounted(() => {
  window.removeEventListener('categories-updated', handleCategoriesUpdate)
})
</script>

<style scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.form-modal {
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
}

.form-header h2 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(220, 38, 38, 0.2);
  color: #ffffff;
}

.content-form {
  padding: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.section-title {
  color: #8b5cf6;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #f5f5f5;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  background: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  background: rgba(51, 65, 85, 1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #6b7280;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #f5f5f5;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
}

.category-selector {
  display: flex;
  gap: 10px;
}

.category-dropdown {
  flex: 1;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-dropdown:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.category-dropdown option {
  background: rgba(30, 41, 59, 0.95);
  color: #ffffff;
}

.add-category-btn {
  padding: 12px 16px;
  background: #8b5cf6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-category-btn:hover {
  background: #7c3aed;
}

.category-help {
  font-size: 12px;
  color: #a0a0a0;
  margin-top: 8px;
  font-style: italic;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  color: #ffffff;
  font-size: 12px;
}

.remove-tag {
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.remove-tag:hover {
  background: rgba(220, 38, 38, 0.2);
  color: #ffffff;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(51, 65, 85, 0.8);
  color: #a0a0a0;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.btn-secondary:hover {
  background: rgba(51, 65, 85, 1);
  color: #ffffff;
}

/* 只读字段样式 */
.readonly-field {
  background: rgba(51, 65, 85, 0.5) !important;
  border: 1px solid rgba(139, 92, 246, 0.2) !important;
  color: #a0a0a0 !important;
  cursor: not-allowed !important;
}

.readonly-field:focus {
  outline: none !important;
  border-color: rgba(139, 92, 246, 0.2) !important;
  box-shadow: none !important;
  background: rgba(51, 65, 85, 0.5) !important;
}

.readonly-help {
  color: #8b5cf6 !important;
  font-style: italic;
  margin-top: 5px;
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-modal {
    margin: 10px;
    max-height: 95vh;
  }
  
  .form-header {
    padding: 15px 20px;
  }
  
  .form-header h2 {
    font-size: 20px;
  }
  
  .content-form {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
