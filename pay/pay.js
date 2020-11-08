var data = JSON.parse(sessionStorage.getItem('data'));
var id = parseInt(window.location.search.slice(window.location.search.indexOf('=') + 1));
var orderList = data.orderList;
var addressList = data.addressList;

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

// 用户信息展示
(function() {
	var order = orderList.find(function(item) { return item.id === id; });
	var address = addressList.find(function(item) { return item.id === order.addressId; });
	document.querySelector('.should-price>span.price').innerText = `￥${ order.account.toFixed(2) }`;
	document.querySelector('.product-message>span.person').innerText = `
		${ address.receiveName }  ${ address.receivePhone } ${ address.receiveRegion } ${ address.receiveAddress }
	`;
	document.querySelector('.pay>.content-wrapper>.end-pay>span.account').innerText = `￥${ order.account.toFixed(2) }`;
	document.querySelector('.order-num>span.num').innerText = `${ id }`;
})();

// 支付方式绑定点击事件
(function() {
	var lis = document.querySelectorAll('.pay-way>.content>ul>li');
	lis.forEach(function(li) { 
		li.onclick = function() {
			if(this.classList.contains('active')) return;
			lis.forEach(function(item) { item.classList.remove('active'); });
			this.classList.add('active');
		};
	});
})();

var hour = 0.5;
var payTimer = null;
var endTime = [0,0,0,0];
// 倒计时
function timer() {
	payTimer = setInterval(function() {
		var orderDate = orderList.find(function(item) { return item.id === id; }).date;
		var endDate = orderDate + hour*3600000;
		var newDate = new Date().getTime();
		var time = endDate - newDate;
		if(time <= 0) {
			Message.notice('订单超时，请重新购买');
			window.location.replace('../index/index.html');
		};
		var firstValue = Math.floor(time/60000/10);
		var secondValue = Math.floor(time/60000%10);
		var thirdValue = Math.floor(time%60000/1000/10);
		var fourthValue = Math.floor(time%60000/1000%10);
		document.querySelector('.base-info>.timer>span.timer-minute-a').innerText = firstValue;
		document.querySelector('.base-info>.timer>span.timer-minute-b').innerText = secondValue;
		document.querySelector('.base-info>.timer>span.timer-second-a').innerText = thirdValue;
		document.querySelector('.base-info>.timer>span.timer-second-b').innerText = fourthValue;
	}, 1000);
}

(function() {
	timer();
})();

// 支付
(function() {
	document.querySelector('.pay-way>.content>span.btn-next').onclick = function() {
		document.querySelector('.pay').classList.add('active');
		document.querySelector('.curtain').classList.add('active');
		var order = orderList.find(function(item) { return item.id === id; });
		if(order.isPay) document.querySelector('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').innerText = '已支付';
	};
	document.querySelector('.pay>.icon-wrapper>i').onclick = function() {
		this.parentNode.parentNode.classList.remove('active');
		document.querySelector('.curtain').classList.remove('active');
	};
	document.querySelector('.pay>.content-wrapper>.btn-wrapper>span.btn-cancel').onclick = function() {
		document.querySelector('.pay').classList.remove('active');
		document.querySelector('.curtain').classList.remove('active');
	};
	document.querySelector('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').onclick = function() {
		var order = orderList.find(function(item) { return item.id === id; });
		if(order.isPay) return;
		Message.confirm('确定支付吗？',function() {
			document.querySelector('.pay>.content-wrapper>.btn-wrapper>span.btn-ok').innerText = '已支付';
			document.querySelector('.base-info>span.icon-top').innerText = `订单已支付，等待发货中`;
			document.querySelector('.base-info>span.icon-bottom').innerText = `尊敬的顾客，感谢您的光顾，以后请多多支持`;
			document.querySelector('.base-info>span.icon-bottom').style.marginLeft = '-225px';
			document.querySelector('.base-info>.timer>span.timer-minute-a').innerText = endTime[0];
			document.querySelector('.base-info>.timer>span.timer-minute-b').innerText = endTime[1];
			document.querySelector('.base-info>.timer>span.timer-second-a').innerText = endTime[2];
			document.querySelector('.base-info>.timer>span.timer-second-b').innerText = endTime[3];
			clearInterval(payTimer);
			order.isPay = true;
			sessionStorage.setItem('data',JSON.stringify(data));
		});
	};
})();

(function() {
	var order = orderList.find(function(item) { return item.id === id; });
	if(order.isPay) {
		document.querySelector('.base-info>span.icon-top').innerText = `订单已支付，等待发货中`;
		document.querySelector('.base-info>span.icon-bottom').innerText = `尊敬的顾客，感谢您的光顾，以后请多多支持`;
		document.querySelector('.base-info>span.icon-bottom').style.marginLeft = '-225px';
		clearInterval(payTimer);
		document.querySelector('.base-info>.timer>span.timer-minute-a').innerText = endTime[0];
		document.querySelector('.base-info>.timer>span.timer-minute-b').innerText = endTime[1];
		document.querySelector('.base-info>.timer>span.timer-second-a').innerText = endTime[2];
		document.querySelector('.base-info>.timer>span.timer-second-b').innerText = endTime[3];
	}
})();

// 购物车件数
(function() {
	var name = Cookies.get('user');
	var pcount = Cookies.get('pcount');
	pcount = 0;
	JSON.parse(sessionStorage.getItem('data')).cartList.filter(function(item)
	{return item.name === name;}).forEach(function(item) {
		pcount += item.count;
	});
	Cookies.set('pcount',pcount);
})();
















