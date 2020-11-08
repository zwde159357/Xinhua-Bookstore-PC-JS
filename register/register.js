var data = JSON.parse(sessionStorage.getItem('data'));
var userList = data.userList;

// 控制协议
(function() {
	document.querySelector('.protocol-top>i').onclick = function() {
		window.location.href = '../index/index.html';
	};
	document.querySelector('span.btn-cancel').onclick = function() {
		window.location.href = '../index/index.html';
	};
	document.querySelector('span.btn-agree').onclick = function() {
		document.querySelector('.register-protocol').classList.remove('active');
		document.querySelector('.curtain').classList.remove('active');
	};
})();

// 获取设置的账号密码
(function() {
	document.querySelector('.form-item-wrapper>span.register').onclick = function() {
		var form = document.forms['register'];
		var obj = {
			id: userList[userList.length-1].id + 1,
		};
		
		var inputTestNum = document.querySelector('input.test-num').value.trim();
		if(!!userList.find(function(item) { return item.name === form.name.value; })) {
			Message.notice('用户名已存在！');
			return;
		}
		obj.name = form.name.value;
		
		if(form.pwd.value !== form.rePwd.value) {
			Message.notice('两次密码不一致！');
			return;
		}
		obj.pwd = form.pwd.value;
		
		
		if(!!userList.find(function(item) { return item.phone === form.phone.value;})) {
			Message.notice('该手机号已被使用！');
			return;
		}
		obj.phone = form.phone.value;
		
		console.log(obj);
		if(form.test.value !== form.test.dataset.val) {
			Message.notice('图片验证码出错！');
			return;
		}
		
		if(inputTestNum === '获取验证码' || inputTestNum.toUpperCase() !== document.querySelector('span.test').innerText) {
			Message.notice('获取验证码错误');
			return;
		}
		
		userList.push(obj);
		sessionStorage.setItem('data',JSON.stringify(data));
		window.location.href = '../login/login.html';
	};
})();

// 获取验证码
(function() {
	document.querySelector('span.test').onclick = function() {
		var codes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q',
					 'R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9'];
		var codeStr = '';
		for(var i = 0; i < 4; i++) {
			codeStr += codes[Math.floor(Math.random()*codes.length)];
		}
		this.innerText = codeStr;
	};
})();










































