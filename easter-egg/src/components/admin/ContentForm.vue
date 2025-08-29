<template>
  <div class="form-overlay" @click="handleOverlayClick">
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
            
            <div class="form-group" v-if="!isEdit">
              <label for="address_bar">地址栏标识 *</label>
              <input
                id="address_bar"
                v-model="formData.address_bar"
                type="text"
                required
                placeholder="请输入地址栏标识"
              />
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
              <div class="tag-input">
                <input
                  id="classify"
                  v-model="newTag"
                  type="text"
                  placeholder="输入标签后按回车添加"
                  @keyup.enter="addTag"
                />
                <button type="button" class="add-tag-btn" @click="addTag">+</button>
              </div>
              <div class="tags-container" v-if="formData.classify.length > 0">
                <span 
                  v-for="(tag, index) in formData.classify" 
                  :key="index"
                  class="tag"
                >
                  {{ tag }}
                  <button type="button" @click="removeTag(index)" class="remove-tag" :title="`删除标签: ${tag}`">×</button>
                </span>
              </div>
              <!-- 调试信息 -->
              <div v-if="formData.classify.length > 0" style="font-size: 12px; color: #666; margin-top: 5px;">
                当前标签数量: {{ formData.classify.length }} | 标签内容: {{ formData.classify.join(', ') }}
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
              <label for="iframe_url">视频URL</label>
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
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? '保存中...' : (isEdit ? '更新' : '创建') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  contentType: {
    type: String,
    required: true
  },
  editData: {
    type: Object,
    default: null
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
  label: '',
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

// 新标签输入
const newTag = ref('')
const isSubmitting = ref(false)

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
      label: props.contentType.toUpperCase(),
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

// 添加标签
const addTag = () => {
  if (props.contentType === 'news') return // 新闻管理禁用标签功能
  
  const tag = newTag.value.trim()
  if (tag && !formData.value.classify.includes(tag)) {
    formData.value.classify.push(tag)
    newTag.value = ''
  }
}

// 移除标签
const removeTag = (index) => {
  if (props.contentType === 'news') return // 新闻管理禁用标签功能
  
  formData.value.classify.splice(index, 1)
}

// 处理表单提交
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    
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
    
    // 发送保存事件
    emit('save', dataToSave)
    
  } catch (error) {
    console.error('表单提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 处理遮罩层点击
const handleOverlayClick = () => {
  emit('close')
}

// 监听编辑数据变化
watch(() => props.editData, initFormData, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
  initFormData()
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

.tag-input {
  display: flex;
  gap: 10px;
}

.tag-input input {
  flex: 1;
}

.add-tag-btn {
  padding: 12px 16px;
  background: #8b5cf6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-tag-btn:hover {
  background: #7c3aed;
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
