var data = JSON.parse(sessionStorage.getItem('data'));
var categoryList = data.categoryList;
// 分类
categoryList.filter(function(item) { return item.fid === 0; }).forEach(function(item,i) {
	this.i = i;
	var liEl = document.createElement('li');
	liEl.className = 'v-middle';
	liEl.innerHTML = `
		<a href='#'>
			${ item.name }
		</a>
	`;
	
	//一级菜单下面小标题
	var tCategoryList = categoryList.filter(function(item2) { return item2.tid; });
	var tUlEl = document.createElement('ul');
	tUlEl.className = 'category-bott';
	tCategoryList.filter(function(item2) { return item2.tid === item.id; }).forEach(function(item2) {
		tUlEl.innerHTML += `
			<li>
				<a href='#'>${ item2.name }</a>
			</li>
		`;
	});

	var subCategoryList = categoryList.filter(function(item2) { return item2.fid === item.id; });
	var subUlEl = document.createElement('ul');
	subUlEl.className = 'category-sub';
	subUlEl.style.top = this.i*50 <= 450 ? `${ this.i*50 }px` : "300px";
	
	if(subCategoryList.length === 0){
		subUlEl.innerHTML = "<li>暂无相关信息</li>"
	}
	else {
		subCategoryList.forEach(function(item2,i) {
			var subLiEl = document.createElement('li');
			if(item2.id === 12) {
				subLiEl.innerHTML = `
					<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
				`;
			}
			else if(item2.id === 16) {
				subLiEl.innerHTML = `
					<a href='../list/list.html?cid=${ item2.id }'>${ item2.name }</a>
				`;
			}
			else {
				subLiEl.innerHTML = `
					<a href='#'>${ item2.name }</a>
				`;
			}
			var minUlEl = document.createElement('ul');
			categoryList.filter(function(item3) { return item3.fid === item2.id; }).forEach(function(item3) {
				minUlEl.innerHTML += `
					<li>
						<a href='#'>${ item3.name }</a>
					</li>
				`;
			});
			subLiEl.appendChild(minUlEl);
			subUlEl.appendChild(subLiEl);
		});
	}
	liEl.appendChild(tUlEl);
	liEl.appendChild(subUlEl);
	document.querySelector('ul.category-main').appendChild(liEl);
});

// 1.确保用户当前是登录
var userName = Cookies.get('user');
if(typeof userName === 'undefined') {
	Cookies.set('backUrl',window.location.href);
	window.location.href = '../login/login.html';
}

// 2.根据用户名找出用户购物车的信息并展示
var data = JSON.parse(sessionStorage.getItem('data'));
var productList = data.productList;
var cartList = data.cartList;

//公共的函数，更新当前购物车的总金额和总数量
function updateTotalAndAccount() {
	var trs = document.querySelectorAll('table.cart-list>tbody>tr');
	var total = 0, account = 0;
	
	trs.forEach(function(tr) {
		if(tr.dataset.checked === '1') {
			total += parseInt(tr.dataset.count);
			account += parseFloat(tr.dataset.price) * parseInt(tr.dataset.count);
		}
	});
	document.querySelector('span.account').innerText = account.toFixed(2);
	document.querySelector('span.total').innerText = total;
	document.querySelector('span.all-product>span.product-count').innerText = total;	
	Cookies.set('pcount',total);
}

//展示用户购物车中的商品信息
(function() {
	var userCartList = cartList.filter(function(item) {
		return item.name === userName;
	});
	//判断购物车是否为空
	if(userCartList.length > 0) {
		document.querySelector('.cart-list-middle').className += ' show'; 
	}
	else {
		document.querySelector('.cart-empty').className += ' show'; 
	}
	//展示用户购物车中的商品信息
	var tbodyEl = document.querySelector('table.cart-list>tbody');
	userCartList.forEach(function(item) {
		//找一个
		var product = productList.find(function(item2) { return item2.id === item.pid; });
		tbodyEl.innerHTML += `
		
		<tr data-id='${ item.id }' data-checked='1' data-price='${ product.price }' data-count='${ item.count }'>
			<td><i class='checkbox checked'></i></td>
			<td><img src='${ product.image }'></td>
			<td><span class='product-name'>${ product.name }</span></td>
			<td>￥<span class='product-price'>${ product.price }</span>元</td>
			<td>
				<span class="btn-decrease ${ item.count === 1 ? 'disabled' : ''}">-</span>
				<span class='count'>${ item.count }</span>
				<span class="btn-increase ${ item.count === 6 ? 'disabled' : ''}">+</span>
			</td>
			<td>￥<span class='product-price-all'>${ (parseFloat(product.price) * item.count).toFixed(2) }</span>元</td>
			<td><span class='btn-remove'>删除<span></td>
		</tr>
		`;
	});
	updateTotalAndAccount();
})();

// 3.删除
(function() {
	// 与用户沟通 确定返回bool值为真
	var btns = document.querySelectorAll('span.btn-remove');
	btns.forEach(function(btn) {
		btn.onclick = function() {
			var that = this;
			Message.confirm("真删除吗？",function() {
				var tr = that.parentNode.parentNode;
				var id = parseInt(tr.dataset.id);
				tr.parentNode.removeChild(tr);
				var i = cartList.findIndex(function(item) { return item.id === id; });
				cartList.splice(i,1);
				sessionStorage.setItem('data',JSON.stringify(data));
				
				// 如果当前删除的时勾选的购物记录,则需要更新总金额和总数量
				if(tr.dataset.checked === '1') updateTotalAndAccount();
				// updateCheckBoxAll();
				Message.notice("删除成功");
			})

		};
	});
})();

// 4.数量加减功能
(function() {
	// 减功能
	var decreaseBtns = document.querySelectorAll('span.btn-decrease');
	decreaseBtns.forEach(function(item) {
		item.onclick = function() {
			var tr = this.parentNode.parentNode;
			var count = parseInt(tr.dataset.count);
			var id = parseInt(tr.dataset.id);
			if(count === 1) return;
			count--;
			// 联动
			this.parentNode.querySelector('span.btn-increase').classList.remove('disabled');
			this.parentNode.querySelector('span.btn-decrease').classList.toggle('disabled',count === 1);
			this.parentNode.querySelector('span.count').innerText = count;
			tr.querySelector('span.product-price-all').innerText = (count * tr.dataset.price).toFixed(2);
			tr.dataset.count = count;
			if(tr.dataset.checked === '1') updateTotalAndAccount();
			
			//数据的更新
			var cart = cartList.find(function(item2) { return item2.id === id; });
			cart.count = count;
			sessionStorage.setItem('data',JSON.stringify(data));
		};
	});
	var increaseBtns = document.querySelectorAll('span.btn-increase');
	increaseBtns.forEach(function(item) {
		item.onclick = function() {
			var tr = this.parentNode.parentNode;
			var count = parseInt(tr.dataset.count);
			var id = parseInt(tr.dataset.id);
			if(count === 6) return;
			count++;
			// 联动
			this.parentNode.querySelector('span.btn-decrease').classList.remove('disabled');
			this.parentNode.querySelector('span.btn-increase').classList.toggle('disabled',count === 6);
			this.parentNode.querySelector('span.count').innerText = count;
			tr.querySelector('span.product-price-all').innerText = (count * tr.dataset.price).toFixed(2);
			tr.dataset.count = count;
			if(tr.dataset.checked === '1') updateTotalAndAccount();
			//数据的更新
			var cart = cartList.find(function(item2) { return item2.id === id; });
			cart.count = count;
			sessionStorage.setItem('data',JSON.stringify(data));
		};
	});
})();

// 单选复选
(function() {
	var checkedAll = document.querySelector('i.checkbox.all');
	var checkeds = document.querySelectorAll('td>i.checkbox');
	//行勾选
	checkeds.forEach(function(item) {
		item.onclick = function() {
			var tr = this.parentNode.parentNode;
			if(this.className.indexOf('checked') !== -1) {
				this.className = this.className.replace(' checked','');
				tr.dataset.checked = '0';
			}
			else {
				this.className += ' checked';
				tr.dataset.checked = '1';
			}
			updateTotalAndAccount();
			updateCheckBoxAll();
		}
	});
	// 给全选按钮绑定点击事件
	checkedAll.onclick = function() {
		var check = this.className.indexOf(' checked') !== -1;
		if(check) {  //从选中到未选中
			this.className = this.className.replace(' checked', '');
			document.querySelectorAll('tbody>tr').forEach(function(item) {
				item.dataset.checked = '0';
				var i = item.querySelector('i.checkbox');
				i.className = i.className.replace(' checked','');
			});
		}
		else { //从未选中到选中
			console.log(this);
			this.className += ' checked';
			document.querySelectorAll('tbody>tr').forEach(function(item) {
				item.dataset.checked = '1';
				var i = item.querySelector('i.checkbox');
				if(i.className.indexOf('checked') === -1) i.className += ' checked';
			});
		}
		updateTotalAndAccount();
	};
})();

function updateCheckBoxAll() {
	var all = document.querySelector('i.checkbox.all');
	//属性选择器  // 找出所有未选中的任务记录
	var uncheckedTrs = document.querySelectorAll('tbody tr[data-checked = "0"]');
	all.classList.toggle('checked', uncheckedTrs.length === 0);
}

//结算
(function() {
	document.querySelector('button.settle').onclick = function() {
		var checkedTrs = document.querySelectorAll('tbody>tr[data-checked = "1"]');	
		if(checkedTrs.length === 0) {
			Message.notice('没有勾选任何商品');
			return;
		}
		Message.confirm("确定购买吗？", function() {
			var settleIds = '';
			checkedTrs.forEach(function(tr) {
				settleIds += tr.dataset.id + ',';
			});
			settleIds = settleIds.slice(0, -1);
			Cookies.set('settle', settleIds);
			window.location.href = '../order_confirm/order_confirm.html';
		});
	};
})();

// 新华推荐
(function() {
	var publicUl = document.querySelector('.recommend-end>ul.public-ul');
	var recommendList = data.recommendList;
	for(var i = 0; i < 12; i++) {
		var randomItem = recommendList[Math.floor(Math.random() * recommendList.length)];
		publicUl.innerHTML += `
			<li>
				<a href="#">
					<img src="${ randomItem.image }" alt="" />
					<span class="span-text">${ randomItem.name }</span>
					<span class="span-price">￥${ randomItem.price.toFixed(2) }</span>
				</a>
			</li>
		`;
	}
})();