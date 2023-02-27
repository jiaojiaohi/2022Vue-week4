import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl } from './config.js';
createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = `${apiUrl}/admin/signin`;
      axios.post(api, this.user).then((response) => {
        const { token, expired } = response.data;
        // 寫入 cookie token
        // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
        window.location = 'products.html';
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
  },
}).mount('#app');