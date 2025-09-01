// 错误处理工具
export const handleApiError = (error, context = 'API请求') => {
  console.error(`${context}失败:`, error)
  
  let userMessage = '操作失败，请稍后重试'
  let technicalDetails = ''
  
  if (error.response) {
    // 服务器响应了错误状态码
    const status = error.response.status
    const data = error.response.data
    
    switch (status) {
      case 400:
        userMessage = '请求数据格式错误，请检查输入内容'
        technicalDetails = data?.message || '400 Bad Request'
        break
      case 401:
        userMessage = '未授权访问，请重新登录'
        technicalDetails = '401 Unauthorized'
        break
      case 403:
        userMessage = '没有权限执行此操作'
        technicalDetails = '403 Forbidden'
        break
      case 404:
        userMessage = 'API接口不存在，请检查后端服务'
        technicalDetails = '404 Not Found'
        break
      case 422:
        userMessage = '数据验证失败，请检查输入内容'
        technicalDetails = data?.message || '422 Unprocessable Entity'
        break
      case 500:
        userMessage = '服务器内部错误，请联系管理员'
        technicalDetails = data?.message || '500 Internal Server Error'
        break
      case 502:
        userMessage = '服务器网关错误，请稍后重试'
        technicalDetails = '502 Bad Gateway'
        break
      case 503:
        userMessage = '服务暂时不可用，请稍后重试'
        technicalDetails = '503 Service Unavailable'
        break
      default:
        userMessage = `服务器错误 (${status})，请稍后重试`
        technicalDetails = data?.message || `${status} ${error.response.statusText}`
    }
  } else if (error.request) {
    // 请求已发出但没有收到响应
    if (error.code === 'ECONNREFUSED') {
      userMessage = '无法连接到服务器，请检查后端服务是否启动'
      technicalDetails = 'Connection refused'
    } else if (error.code === 'NETWORK_ERROR') {
      userMessage = '网络连接错误，请检查网络设置'
      technicalDetails = 'Network error'
    } else if (error.code === 'ECONNABORTED') {
      userMessage = '请求超时，请稍后重试'
      technicalDetails = 'Request timeout'
    } else {
      userMessage = '网络请求失败，请检查网络连接'
      technicalDetails = error.message
    }
  } else {
    // 其他错误
    userMessage = error.message || '未知错误'
    technicalDetails = error.message
  }
  
  // 在开发环境下显示技术细节
  if (import.meta.env.DEV) {
    console.error('技术细节:', technicalDetails)
    console.error('完整错误对象:', error)
  }
  
  return {
    userMessage,
    technicalDetails,
    originalError: error
  }
}

// 显示用户友好的错误消息
export const showErrorMessage = (error, context = 'API请求') => {
  const { userMessage, technicalDetails } = handleApiError(error, context)
  
  let message = userMessage
  if (import.meta.env.DEV && technicalDetails) {
    message += `\n\n技术细节: ${technicalDetails}`
  }
  
  alert(message)
  return { userMessage, technicalDetails }
}