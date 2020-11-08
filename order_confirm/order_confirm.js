var data = JSON.parse(sessionStorage.getItem('data'));
var cartList = data.cartList;
var cartIds = Cookies.get('settle');
if(!cartIds) window.location.replace('../index/index.html');
cartIds = cartIds.split(',').map(function(item) { return parseInt(item); });
// map 映射 不会改变原数组 生成一个新的数组,映射规则由函数决定

var userName = Cookies.get('user');

var addressId = 0;

// 头部
(function() {
	if(Cookies.get('user')) {
		document.querySelector('.top-mid-left').innerHTML = `
			<span>您好! <span class="user-name">${ Cookies.get('user') }  </span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="#" class='exit-login'>退出登录</a>
		`;
		document.querySelector('a.exit-login').onclick = function() {
			Cookies.remove('user');
			Cookies.remove('pcount');
			window.location.href = window.location.href;
		};
	}
	else
	{
		Cookies.set('backUrl',window.location.href);
		document.querySelector('.top-mid-left').innerHTML = `
			<span>因疫情影响，北京市物流暂无法保证时效，具体恢复时间待定，给您带来不便敬请谅解！</span>
			<a href="../login/login.html">请登录</a>
			<a href="../register/register.html">免费注册</a>
		`;
	}
})();

// 判断是否从新建地址页面跳回
if(Cookies.get('addressId')) {
	addressId = parseInt(Cookies.get('addressId'));
	Cookies.remove('addressId');
}

(function() {
	var userAddressList = data.addressList.filter(function(item) { return item.name === userName; });
	userAddressList.forEach(function(item) {
		document.querySelector('table.consignee-address>tbody').innerHTML += `
			<tr data-id='${ item.id }'
				class='${ (addressId !== 0 && item.id === addressId) || (item.isDefault && addressId === 0) ? 'select' : '' }'
			>
				<td>
					<input type="radio"  ${ item.isDefault ? 'checked' : '' } />
				</td>
				<td>
					<span class="name">${ item.receiveName }</span>
				</td>
				<td>
					<span class="address">${ item.receiveRegion } ${ item.receiveAddress }</span>
				</td>
				<td>
					<span class="phone">${ item.receivePhone }</span>
				</td>
				<td>
					<span class="default">${ item.isDefault ? '默认' : '' }</span>
				</td>
			</tr>
		`; 
		if(item.isDefault && addressId === 0) addressId = item.id;
	});
	
	document.querySelectorAll('table.consignee-address>tbody>tr').forEach(function(tr) {
		tr.onclick = function() {
			if(this.classList.contains('select')) return;
			this.parentNode.querySelectorAll('tr').forEach(function(item) { item.classList.remove('select'); });
			this.classList.add('select');
			this.parentNode.querySelectorAll('td>input').forEach(function(item) { item.checked = false; });
			this.querySelector('td>input').checked = true;
			this.parentNode.querySelectorAll('tr>td>span.default').forEach(function(item) { item.innerText = '';});
			this.querySelector('span.default').innerText = '默认';
			addressId = parseInt(this.dataset.id);
		};
	});

	document.querySelector('a.btn-goto-address').onclick = function() {
		Cookies.set('isFromOrderConfirm',' ');
		window.location.href = '../address/address.html';
	};
	
})();

// 商品清单
var account = 0;
var productCount = 0;
var detail = [];

(function() {
	cartIds.forEach(function(cartId) {
		var cart  = cartList.find(function(item) { return item.id === cartId; });
		var product  = data.productList.find(function(item) { return item.id === cart.pid; });
		detail.push( { pid: cart.pid, count: cart.count, price: product.price } );
		account += cart.count * product.price;
		productCount += cart.count;
		 document.querySelector('table.product-message>tbody').innerHTML += `
			<tr>
				<td>
					<div class="image-wrapper">
						<img src="${ product.image }" alt="" />
					</div>
					<div class="name-wrapper">
						<span>${ product.name }</span>
					</div>
				</td>
				<td>
					<span class='price'>￥${ product.price }</span>
				</td>
				<td>
					<span>Ｘ${ cart.count }</span>
				</td>
				<td>
					<span class='price'>￥${ (cart.count*product.price).toFixed(2) }</span>
				</td>
			</tr>
		 `;
	});
	
})();

// 展示相关信息
(function() {
	
	var proCount = document.querySelector('.detail-message>.summary>.account>span.text>span.product-count');
	proCount.innerText = productCount;
	
	document.querySelector('.detail-message>.summary>.account>span.price').innerHTML = `￥${ parseFloat(account).toFixed(2) }`;
	
	document.querySelector('.end-message>.content>.end-price>span.price').innerHTML = `￥${ parseFloat(account).toFixed(2) }`;
	
	var userInfo = document.querySelector('.end-address');
	var address = data.addressList.find(function(item) { return item.id === addressId; });
	userInfo.querySelector('.address>span.address').innerHTML = `${ address.receiveRegion } ${ address.receiveAddress }`;
	userInfo.querySelector('.user-info>span.name').innerText = address.receiveName;
	userInfo.querySelector('.user-info>span.phone').innerText = address.receivePhone;
	
})();

// 生成订单
(function() {
	document.querySelector('span.btn-generate-order').onclick = function() {
		if(addressId === 0) {
			Message.alert('你想送到哪');
			return;
		}
		
		// 从购物车中删除对应的购物记录
		cartIds.forEach(function(cartId) {
			var i = cartList.findIndex(function(item) { return item.id === cartId; });
			cartList.splice(i,1);
		});
		
		// 构造一个新的订单push到orderList中
		var id = data.orderList.length > 0 ? data.orderList[data.orderList.length - 1].id + 1 : 1;
		data.orderList.push({
			id: id,
			name: userName,
			addressId: addressId,
			detail: detail,
			account: account,
			date: new Date().getTime(),
			isPay: false
		});
		sessionStorage.setItem('data',JSON.stringify(data));
		Cookies.remove('settle');
		window.location.replace(`../pay/pay.html?id=${ id }`);
	};
})();
