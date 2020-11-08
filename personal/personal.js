var data = JSON.parse(sessionStorage.getItem('data'));

// 确保当前用户是登录
var userName = Cookies.get('user');
if(typeof userName === 'undefined' ) {
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

// 将登录用户的信息展示
(function() {
	document.querySelector('.user-info>span.name').innerText = userName;
})();

// 点击收货地址管理后跳转
(function() {
	var address = document.querySelector('li>ul>li.address');
	address.onclick = function() {
		window.location.href = '../address/address.html';
	};
})();

// 新华推荐
(function() {
	var publicUl = document.querySelector('.recommend-end>ul.public-ul');
	var recommendList = data.recommendList;
	for(var i = 0; i < 10; i++) {
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

// 绑定点击事件
(function() {
	document.querySelector('.personal-content>.nav>ul>li:nth-child(1)>ul>li:nth-child(1)').onclick = function() {
		window.location.href = '../order_management/order_management.html';
	};
})();

var orderList = data.orderList;
console.log(orderList);
// 信息
(function() {
	var i = 0, j = 0;
	orderList.forEach(function(item) {
		if(item.isPay) {
			document.querySelector('.member>.message>ul>li:nth-child(2)>span>span').innerText = `${ ++i }`;
		}else {
			document.querySelector('.member>.message>ul>li:nth-child(1)>span>span').innerText = `${ ++j }`;
		}
	});
	var table = document.querySelector('.my-order>table.table-top');
	var tbody = document.querySelector('.my-order>table.table-top>tbody.null');
	console.log(table);
	if(orderList.length === 0) return;
	table.removeChild(tbody);
	table.innerHTML += `
		<tbody class="content">
		</tbody>
	`;
	
	var tbodyCon = document.querySelector('.my-order>table.table-top>tbody.content');
	orderList.forEach(function(item) {
		var product = data.productList.find(function(product) { return product.id === item.detail[item.detail.length - 1].pid; });	
		date = item.date;
		var time = new Date(date);
		console.log(time);
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
		tbodyCon.innerHTML += `
			<tr>
				<td>
					<div class="wrapper">
						<img src="${ product.image }" alt="" />
					</div>
				</td>
				<td>
					<span class="name">${ product.name }</span>
					<span class="id">订单编号：${ item.id }</span>
					<span class="time">下单时间：${ year }-${ month }-${ day } ${ hour }:${ minute }:${ second }</span>
				</td>
				<td>
					<span class="account">￥${ item.account }</span>
				</td>
				<td>
					<span class="num">共${ item.detail.length }件</span>
					<span class="message">${ item.isPay ? '订单待发货' : '订单待付款'}</span>
				</td>
				<td>
					<span class="link"><a href="../order_management/order_management.html">查看订单详情</a></span>
				</td>
			</tr>
		`;
	});
})();












