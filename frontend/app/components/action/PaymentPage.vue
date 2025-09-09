<script setup lang="ts">
const drawerContent = useDrawer();

const states = reactive({
  loading: false,
  errorText: null as null | string,
});

const handleRefreshPage = () => {
  states.errorText = null;
  states.loading = true;
};

const handleWebViewLoad = () => {
  states.loading = false;
};

const handleWebViewError = () => {
  states.loading = false;
  states.errorText = 'Не удалось загрузить платежную страницу';
};

const handleMessage = (event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data);

    if (data.type === 'payment_success') {
      console.log('Платеж успешен:', data);
    } else if (data.type === 'payment_failed') {
      console.log('Платеж не удался:', data);
    }
  } catch (error) {
    console.error('Ошибка обработки сообщения:', error);
  }
};

onMounted(() => {
  window.addEventListener('message', handleMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<template>
  <div style="height: 100%;">
    <base-page class="mt-2 h-[100%]" :loading="states.loading" :error-text="states.errorText" :show-error-btn="true"
      @refresh="handleRefreshPage">
      <iframe v-if="drawerContent.paymentUrl" :src="drawerContent.paymentUrl" class="payment-webview"
        @load="handleWebViewLoad" @error="handleWebViewError" frameborder="0" allow="payment *"
        allowfullscreen></iframe>

    </base-page>
  </div>
</template>

<style scoped>
.payment-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.payment-title {
  text-align: center;
  color: #333;
  font-size: 24px;
  font-weight: bold;
}

.webview-wrapper {
  width: 100%;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-webview {
  width: 100%;
  height: 100%;
  border: none;
}

.payment-info {
  text-align: center;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .webview-wrapper {
    height: 500px;
  }

  .payment-container {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .webview-wrapper {
    height: 400px;
  }

  .payment-title {
    font-size: 20px;
  }
}

.l-label {
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-bottom: 20px;
}

.l-label input {
  border: 1px solid gray;
  border-radius: 10px;
  padding: 10px;
  font-size: 16px;
}

.l-label input:focus {
  outline: none;
  border-color: #de9f51;
  box-shadow: 0 0 0 1px rgb(163, 104, 15);
}
</style>