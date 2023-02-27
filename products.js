import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl,apiPath } from './config.js';
import  pagination  from './pagination.js';
let productModal = null;
let delProductModal = null;

const app =createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      page: {},
      status : false,//確認是新增還是編輯產品
    }
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();

   //1.初始化2.呼叫方式
  productModal = new bootstrap.Modal(document.getElementById('productModal'), {
     keyboard: false
   }); 
   delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
     keyboard: false
   });
  
 },
  methods: {
    checkAdmin() {
      const url = `${apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getProducts(page = 1) {//取產品列表
      const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;
      axios.get(url).then((response) => {
        this.products = response.data.products;
        this.page = response.data.pagination;
        console.log(response.data);
      }).catch((err) => {
        alert(err.response.data.message);
        window.location = 'login.html';
      })
    },
    updateProduct() {
      let url = `${apiUrl}/api/${apiPath}/admin/product`;//新增
      let http = 'post';

      if (!this.status ) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getProducts();//更新完要重新取得
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    openModal(status , item) {//開啟建立新/修改/刪除產品
      if (status  === 'new') {
        //debugger;
        console.log('new');
        this.tempProduct = {
          imagesUrl: [],
        };
        this.status  = true;
        productModal.show();
      } else if (status  === 'edit') {
        console.log('edit');

        this.tempProduct = { ...item };
        this.status  = false;
        productModal.show();
      } else if (status  === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },
    delProduct() {
      const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getProducts();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
 
  components:{
    pagination,
  },
});
app.component('product-modal',{
  props:['tempProduct','updateProduct','status'],
  template:'#product-modal-template',
});
app.mount('#app');