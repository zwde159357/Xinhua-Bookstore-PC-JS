// 获取验证码
(function() {
	document.querySelector('span.test-number').onclick = function() {
		var codes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
					 'R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
		var codeStr = '';
		for(var i = 0; i < 4; i++) {
			codeStr += codes[Math.floor(Math.random()*codes.length)];
		}
		this.innerText = codeStr;
	};
})();

// 登录方式切换
(function() {
	document.querySelectorAll('.content-top>ul>li').forEach(function(item,i) {
		item.onclick = function() {
			if(item.classList.contains('active')) return;
			this.parentNode.querySelector('.active').classList.remove('active');
			this.classList.add('active');
			document.querySelector('.content-bottom>.login.active').classList.remove('active');
			document.querySelectorAll('.content-bottom>.login')[i].classList.add('active');
		};
	});
})();

// 用户名密码登录
(function() {
	document.querySelector('span.btn-login-pwd').onclick = function() {
		var name = document.querySelector('.login-pwd>input.name').value;
		var pwd = document.querySelector('input.pwd').value;
		var userList = JSON.parse(sessionStorage.getItem('data')).userList;
		var pcount = 0;
		console.log(pwd);
		if(userList.some(function(item) { return item.name === name && item.pwd === pwd; })) {
			Cookies.set('user',name);
			var backUrl = Cookies.get('backUrl');
			JSON.parse(sessionStorage.getItem('data')).cartList.filter(function(item) 
			{return item.name === name;}).forEach(function(item) {
				pcount += item.count;
			});
			Cookies.set('pcount',pcount);
 			Cookies.remove('backUrl');
			window.location.replace(backUrl || '../index/index.html');
		}
		else {
			Message.notice('用户名或密码错误');
		}
	};
})();

// 手机号登录
(function() {
	document.querySelector('.btn-login-phone').onclick = function() {
		var phone = document.querySelector('.login-test>input.phone').value.trim();
		var pictureTest = document.querySelector('input.picture-test').value.trim();
		var test = document.querySelector('input.test').value.trim();
		console.log(document.querySelector('input.picture-test').dataset.val);
		if(pictureTest !== document.querySelector('input.picture-test').dataset.val) {
			Message.notice('图片验证码错误');
			return;
		}
		console.log(document.querySelector('span.test-number'));
		if(test === '获取验证码' || test.toUpperCase() !== document.querySelector('span.test-number').innerText) {
			Message.notice('获取验证码错误');
			return;
		}
		
		if(!document.querySelector('input.protocol').checked) {
			Message.notice('未勾选协议');
			return;
		}
		
		var userList = JSON.parse(sessionStorage.getItem('data')).userList;
		var name = userList.find(function(item) { return item.phone === phone; }).name;
		var pcount = 0;
		if(userList.some(function(item) { return item.phone === phone; })) {
			Cookies.set('user',name);
			var backUrl = Cookies.get('backUrl');
			Cookies.remove('backUrl');
			JSON.parse(sessionStorage.getItem('data')).cartList.filter(function(item)
			{return item.name === name;}).forEach(function(item) {
				pcount += item.count;
			});
			Cookies.set('pcount',pcount);
			window.location.replace(backUrl || '../index/index.html');
		}
		else {
			Message.notice('手机号不存在');
		}
	};
})();













































