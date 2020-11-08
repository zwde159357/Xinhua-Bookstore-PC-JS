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
	document.querySelector('.personal-content>.nav>ul>li:nth-child(3)>ul>li:nth-child(5)').onclick = function() {
		window.location.href = '../address/address.html';
	};
})();


var data = JSON.parse(sessionStorage.getItem('data'));

// 所有订单
function display(orderList1) {
	if(document.querySelector('.order-title>ul>li:nth-child(2)>a').classList.contains('active')) {
		var orderList = orderList1.filter(function(item) { return item.name === userName && item.isPay === false; });
	}
	else if(document.querySelector('.order-title>ul>li:nth-child(3)>a').classList.contains('active')) {
		var orderList = orderList1.filter(function(item) { return item.name === userName && item.isPay === true; });
	}
	else {
		var orderList = orderList1.filter(function(item) { return item.name === userName; });
	}
	
	var table = document.querySelector('.order-content>.order-list>table');
	table.innerHTML = `
		<thead>
			<tr>
				<th>商品信息</th>
				<th>实付款(元)</th>
				<th>交易状态</th>
				<th>交易操作</th>
			</tr>
		</thead>
	`;
	orderList.forEach(function(item,j) {
		
		table.innerHTML += `
			<tbody class="text-null">
				<tr>
					<td></td>
				</tr>
			</tbody>
			<tbody class="text-content" data-id = '${ item.id }' data-default = '${ item.isPay }'>
				<tr class="top">
					<td colspan="4">
						<span class="time">下单时间：${ item.date }</span>
						<span class="id">订单编号：${ item.id }</span>
						<span class="shop">商家：新华书店网上商城自营图书</span>
						<span class="btn-contact">联系客服</span>
					</td>
				</tr>
			</tbody>
		`;
		item.detail.forEach(function(item2,i) { 
			var product = data.productList.find(function(item3) { return item3.id === item2.pid; });
			var tbody = table.querySelectorAll('tbody.text-content');
			
			if(i === 0) {
				tbody[j].innerHTML += `
					<tr class="middle" data-id = '${ item.id }'>
						<td>
							<div class="image-wrapper">
								<img src="${ product.image }" alt="" />
							</div>
							<span class="name">${ product.name } </span>
							<span class="price">￥${ product.price }</span>
							<span class="count">Ｘ${ item2.count }</span>
						</td>
						<td rowspan="${ item.detail.length }">
							<span class="account">￥${ item.account.toFixed(2) }</span>
						</td>
						<td rowspan="${ item.detail.length }">
							<span class="text">${ item.isPay ? '订单待发货' : '订单待支付' }</span><br>
							<a href="#">查看订单详情</a>
						</td>
						<td rowspan="${ item.detail.length }" class='last'>
							${ item.isPay ? '' : "<span class='timer'></span>"}
							${ item.isPay ? '' : "<span class='operate'>支付</span>" }
						</td>
					</tr>
				`;
			}
			else {
				tbody[j].innerHTML += `
					<tr class="middle">
						<td>
							<div class="image-wrapper">
								<img src="${ product.image }" alt="" />
							</div>
							<span class="name">${ product.name } </span>
							<span class="price">￥${ product.price.toFixed(2) }</span>
							<span class="count">Ｘ${ item2.count }</span>
						</td>
					</tr>
				`;
			}
		});
	});
}

function countNum() {
	var orderList1 = data.orderList;
	var m = 0, n = 0;
	orderList1.forEach(function(item,j) {
		document.querySelector('.order-title>ul>li>a>span.no-pay').innerText = n
		if(item.isPay) document.querySelector('.order-title>ul>li>a>span.no-give').innerText = ++m;
		else document.querySelector('.order-title>ul>li>a>span.no-pay').innerText = ++n;
	});
	display(orderList1);
}

// 选项卡切换
(function() {
	var liA = document.querySelectorAll('.order-title>ul>li>a');
	liA.forEach(function(item, i) {
		item.onclick = function() {
			if(this.classList.contains('active')) return;
			document.querySelector('.order-title>ul>li>a.active').classList.remove('active');
			this.classList.add('active');
			if(this.querySelector('span').innerText === '0') {
				if(document.querySelector('.order-null').classList.contains('active')) return;
				document.querySelector('.order-content').classList.remove('active')
				document.querySelector('.order-null').classList.add('active');
				
			}
			else if(this.querySelector('span').innerText === '') {
				document.querySelector('.order-null').classList.remove('active');
				document.querySelector('.order-content').classList.add('active');
				var orderList1 = data.orderList;
				display(orderList1);
				dateCaculate();
				pay();
				clock();
			}
			else {
				document.querySelector('.order-content').classList.remove('active')
				document.querySelector('.order-null').classList.remove('active');
				document.querySelector('.order-content').classList.add('active');
				var orderList1 = data.orderList;
				display(orderList1);
				dateCaculate();
				pay();
				clock();
			}
		};
	});
})();

console.log(document.querySelectorAll('.pay>ul.pay-way>li'));

// 支付
function pay() {
	var textContent = document.querySelectorAll('.text-content');
	textContent.forEach(function(item) {
		if(item.dataset.default === 'true') return;
		
		item.querySelector('span.operate').onclick = function() {
			document.querySelector('.pay').classList.add('active');
			document.querySelector('.curtain').classList.add('active');
			var orderList2 = data.orderList;
			var id = item.dataset.id;
			var order = orderList2.find(function(item) { return item.id === parseInt(id); });
			document.querySelector('.pay>.content-wrapper>.end-pay>span.account').innerText = `￥${ order.account.toFixed(2) }`;
		};
		document.querySelector('.pay>.icon-wrapper>i').onclick = function() {
			this.parentNode.parentNode.classList.remove('active');
			document.querySelector('.curtain').classList.remove('active');
		};
		
		document.querySelectorAll('.pay>ul.pay-way>li').forEach(function(li, i) {
			
			li.onclick = function() {
				if(this.classList.contains('active')) return;
				this.parentNode.querySelector('li.active').classList.remove('active');
				this.classList.add('active');
			};
		});
		
		document.querySelector('.pay>.content-wrapper>.btn-wrapper>span.btn-cancel').onclick = function() {
			document.querySelector('.pay').classList.remove('active');
			document.querySelector('.curtain').classList.remove('active');
		};
		document.querySelector('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').onclick = function() {
			Message.confirm('确定支付吗？',function() {
				document.querySelector('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').innerText = '已支付';
				var orderList = data.orderList;
				var id = item.dataset.id;
				var order = orderList.find(function(item) { return item.id === parseInt(id); });
				order.isPay = true;
				sessionStorage.setItem('data',JSON.stringify(data));
				item.querySelector('.text-content>tr.middle>td>span.text').innerText = '订单已支付';
				item.querySelector('.text-content>tr.middle>td.last').innerHTML = ``;
				console.log(item.querySelector('.text-content>tr.middle>td>span.text'));
				display(data.orderList);
				countNum();
				window.location.href = window.location.href;
			});
		};
	});
}

var hour = 0.5;
// 倒计时
function clock() {
	var textContent = document.querySelectorAll('.text-content');
	textContent.forEach(function(item, i) {
		if(item.dataset.default === 'true') return;
		var orderList = data.orderList;
		var timer = item.querySelector('span.timer');
		var id = item.dataset.id;
		var orderDate = orderList.find(function(item1) { return item1.id === parseInt(id); }).date;
		var endDate = orderDate + hour*3600000;
		var newDate = new Date().getTime();
		var time  = endDate - newDate;
		var clearTimer = null; // 不能生成全局变量
		clearTimer = setInterval(function() {
			var newDate = new Date().getTime();
			var time  = endDate - newDate;
			var firstValue = Math.floor(time/60000/10);
			var secondValue = Math.floor(time/60000%10);
			var thirdValue = Math.floor(time%60000/1000/10);
			var fourthValue = Math.floor(time%60000/1000%10);
			timer.innerText = `${firstValue}${secondValue} : ${thirdValue}${fourthValue}`;
			if(time <= 0) {
				window.clearInterval(clearTimer);
				clearTimer = null;
				var order = orderList.find(function(item) { return item.id === parseInt(id); });
				order.isPay = false;
				sessionStorage.setItem('data',JSON.stringify(data));
				item.querySelector('td>span.text').innerText = '订单已关闭';
				item.querySelector('td.last').innerHTML = ``;
			}	
		}, 1000);
	});
}


// 计算日期
function dateCaculate() {
	var textContent = document.querySelectorAll('.text-content');
	textContent.forEach(function(item) {
		var orderList = data.orderList;
		var timer = item.querySelector('span.timer');
		var id = item.dataset.id;
		
		date = orderList.find(function(item) { return item.id === parseInt(id); } ).date;
		var time = new Date(date);
		
		var year = time.getFullYear();
		var month = time.getMonth()+1;
		if(month < 10) {
			month = '0' + month;
		}
		var day = time.getDate();
		if(day < 10) {
			day = '0' + day;
		}
		var hour = time.getHours();
		if(hour < 10) {
			hour = '0' + hour;
		}
		var minute = time.getMinutes();
		if(minute < 10) {
			minute = '0' + minute;
		}
		var second = time.getSeconds();
		if(second < 10) {
			second = '0' + second;
		}
		console.log();
		item.querySelector('tr.top>td>span.time').innerText = `下单时间：${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }`;
	});
}

(function() {
	countNum();
	dateCaculate();
	clock();
	pay();
})();













