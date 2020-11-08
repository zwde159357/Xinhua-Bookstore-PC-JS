// 确保用户当前是登录
var userName = Cookies.get('user');
if(typeof userName === 'undefined') {
	Cookies.set('backUrl',window.location.href);
	window.location.href = '../login/login.html';
}

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

// 获取用户购物车内商品
(function() {
	var pcount = Cookies.get('pcount');
	document.querySelector('span.product-count').innerText = pcount;
})();

// 绑定点击事件
(function() {
	document.querySelector('.personal-content>.nav>ul>li:nth-child(1)>ul>li:nth-child(1)').onclick = function() {
		window.location.href = '../order_management/order_management.html';
	};
})();

// 根据用户名找出用户购物车的信息并展示
var data = JSON.parse(sessionStorage.getItem('data'));
var addressList = data.addressList;

// 1.动态渲染当前用户的地址信息
(function() {
	var userAddressList  = addressList.filter(function(item) { return item.name === userName; });
	document.querySelector('.address-empty').classList.toggle('show', userAddressList.length === 0);
	document.querySelector('.address-display').classList.toggle('show', userAddressList.length !== 0);
	
	if(userAddressList.length > 0) {
		userAddressList.forEach(function(item) {
			document.querySelector('ul.address-list').innerHTML += `
				<li class="${ item.isDefault ? ' active ' : '' }">
					<h3>${ item.receiveName }</h3>
					<h3>${ item.receivePhone }</h3>
					<a href='javascript: void(0)' data-id='${ item.id }' class="btn-default${ item.isDefault ? ' default ' : '' }"></a>
					<p>${ item.receiveRegion }${ item.receiveAddress }</p>
					<span class='btn-update' data-id='${ item.id }'>修改</span>
					<span class='btn-remove' data-id='${ item.id }'>删除</span>
				</li>
			`; 
		});
	}
})();

// 尽量减少点击事件的绑定。尽可能使用冒泡机制
// 绑定点击事件
(function() {
	//开始新增
	document.querySelector('span.btn-add').onclick = function() {
		document.querySelector('.address-edit').classList.add('show');
		document.querySelector('.curtain').classList.add('active');
		var form = document.forms['address'];
		form.editMode.value = '1';
		form.id.value = '';
		// 表单重置 hidden无法重置
		form.reset();
	};
	
	document.querySelector('ul.address-list').onclick = function(e) {
		if(e.target.classList.contains('btn-default')) {
			if(e.target.classList.contains('default')) return; 
			addressList.forEach(function(item) {
				if(item.name === userName) {
					item.isDefault = item.id === parseInt(e.target.dataset.id);
				}
			});
			sessionStorage.setItem('data',JSON.stringify(data));
			
			this.querySelectorAll('a.btn-default').forEach(function(item) { 
				item.classList.remove('default'); 
			});
			
			this.querySelectorAll('li').forEach(function(item) {
				item.classList.remove('active'); 
			});
			
			e.target.classList.add('default');
			e.target.parentNode.classList.add('active');
			Message.notice('默认地址设置成功...');
		}
		
		//如果点的是删除按钮
		if(e.target.classList.contains('btn-remove')) {
			var that = this;
			Message.confirm('确定删除吗？',function() {
				var id = parseInt(e.target.dataset.id);
				var i = addressList.findIndex(function(item) { return item.id === id; });
				addressList.splice(i,1);
				sessionStorage.setItem('data',JSON.stringify(data));
				that.removeChild(e.target.parentNode);
				if(that.querySelectorAll('li').length === 0) {
					that.classList.remove('show');
					document.querySelector('.address-empty').classList.add('show');
				}
				Message.notice('删除成功');
			});
		}
		
		//如果点的是修改按钮
		if(e.target.classList.contains('btn-update')) {
			document.querySelector('.address-edit').classList.add('show');
			document.querySelector('.curtain').classList.add('active');
			var id = parseInt(e.target.dataset.id);
			var form = document.forms['address'];
			form.editMode.value = '0';
			form.id.value = id;
			var target = addressList.find(function(item) { return item.id === id; });
			form.receiveName.value = target.receiveName;
			form.receivePhone.value = target.receivePhone;
			regionPicker.set(target.receiveRegion);
			form.receiveAddress.value = target.receiveAddress;
		}
	};
	
})();

// form专用语法
// document.forms['address']
// 3.保存按钮点击事件
(function() {
	document.querySelector('.btn-save').onclick = function() {
		document.querySelector('.curtain').classList.remove('active');
		var form = document.forms['address'];
		var address = {
			name: userName,
			receiveName: form.receiveName.value,
			receivePhone: form.receivePhone.value,
			receiveRegion: regionPicker.get(),
			receiveAddress: form.receiveAddress.value
		};
		if(form.editMode.value === '1') {
			// 新增
			var id = addressList.length > 0 ? addressList[addressList.length - 1].id + 1 : 1;
			address.id = id;
			address.isDefault = false;
			addressList.push(address);
			sessionStorage.setItem('data',JSON.stringify(data));
			Message.alert('新增成功');
		}else {
			// 修改
			var id = parseInt(form.id.value);
			var i = addressList.findIndex(function(item) { return item.id === id; });
			address.id = id;
			address.isDefault = addressList[i].isDefault;
			addressList.splice(i,1,address);
			sessionStorage.setItem('data',JSON.stringify(data));
			Message.alert('修改成功');
		}
		
		if(Cookies.get('isFromOrderConfirm')) {
			Cookies.remove('isFromOrderConfirm');
			Cookies.set('addressId',address.id);
			window.location.replace('../order_confirm/order_confirm.html');
		}
		else {
			// 原地跳转
			window.location.href = window.location.href;
		}
		
	};
})();

// 给弹出的页面添加绑定事件
(function() {
	var close = document.querySelector('.address-edit-top>i');
	 close.onclick = function() {
		 if(!document.querySelector('.address-edit').classList.contains('show')) return;
		 document.querySelector('.address-edit').classList.remove('show');
		 document.querySelector('.curtain').classList.remove('active');
	 };
})();


// 给弹出的页面的取消按钮添加绑定事件
(function() {
	var close = document.querySelector('.form-item-wrapper>span.btn-close');
	 close.onclick = function() {
		 if(!document.querySelector('.address-edit').classList.contains('show')) return;
		 document.querySelector('.address-edit').classList.remove('show');
		 document.querySelector('.curtain').classList.remove('active');
	 };
})();