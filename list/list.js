var data = JSON.parse(sessionStorage.getItem('data'));
var productList = JSON.parse(sessionStorage.getItem('data')).productList;
var cid = parseInt(window.location.search.slice(window.location.search.indexOf('=')+1));

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
// 分类
var categoryList = data.categoryList;
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
	subUlEl.style.top = this.i*50 <= 600 ? `${ this.i*50 }px` : "300px";
	
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

var ulEl = document.querySelector('.comprehensive-product>ul.list-ul');
for(var i = 0; i < 4; i++) {
	productList.filter(function(item) { return item.cid === cid; }).forEach(function(item) {
		ulEl.innerHTML += `
			<li>
				<a href='../detail/detail.html?did=${ item.id }'>
					<img src='${ item.image }' alt='' />
					<span class='span-text'>${ item.name }</span>
					<span class='span-author'>${ item.author }</span>
					<span class='span-price'>￥${ item.price }</span>
				</a>
			</li>
		`;
	});
}

var navEl = document.querySelector('.return-top');
var scrollTimer = null;
function scroll(top) {
	var newTop = document.documentElement.scrollTop || document.body.scrollTop;
	var diff = newTop-top;
	if(Math.abs(diff) <= 30) {
		window.scrollTo(0, top);
		clearInterval(scrollTimer);
		scrollTimer = null;
	}
	else {
		window.scrollTo(0, diff > 0 ? diff - 30 : diff + 30);
	}
}

navEl.onclick = function() { 
	var top = 0;
	scrollTimer = setInterval(function() { scroll(top); }, 10);
};

window.onmousewheel = function() {
	//如果滚动鼠标滚轮时，存在左边点击激活的滚动任务时，将滚动任务取消
	if(scrollTimer) { clearInterval(scrollTimer); scrollTimer = null; }
};			

var searchList = JSON.parse(sessionStorage.getItem('data')).searchList;
searchList.filter(function(item) { return item.fid === cid; }).forEach(function(item) {
	var warp = document.querySelector('.wrap');
	warp.innerHTML += `
		<span class='result-sum'>${ item.sum }</span>
	`; 
	var options = warp.querySelectorAll('.box-a>select>option');
	if(cid === 12) {
		options[0].selected = true;
		options[1].selected = false;
	}
	else {
		options[1].selected = true;
		options[0].selected = false;
	}
	
	var select = warp.querySelector('.wrap>.box-b>select');
	select.innerHTML += `
		<option selected>${ item.option1 }</option>
		<option>${ item.option2 }</option>
		<option>${ item.option3 }</option>
		<option>${ item.option4 }</option>
	`;
	
	//搜索详情
	var resultDetail = document.querySelector('.result-detail');
	var liA = resultDetail.querySelector('ul>li.li-a');
	liA.innerHTML += `
		<a class="kind-detail">${ item.kind }</a>
	`; 
	
	var ulEls = resultDetail.querySelector('ul>li.li-c>ul.kind-time');
	ulEls.innerHTML += `
		<li>
			<a href="#">${ item.time1 }</a>
		</li>
		<li>
			<a href="#">${ item.time2 }</a>
		</li>
		<li>
			<a href="#">${ item.time3 }</a>
		</li>
		<li>
			<a href="#">${ item.time4 }</a>
		</li>
		<li>
			<a href="#">${ item.time5 }</a>
		</li>
	`; 
	
	var ulElss = resultDetail.querySelector('ul>li.li-e>ul.kind-author');
	ulElss.innerHTML += `
		<li>
			<a href="#">${ item.author1 }</a>
		</li>
		<li>
			<a href="#">${ item.author2 }</a>
		</li>
		<li>
			<a href="#">${ item.author3 }</a>
		</li>
		<li>
			<a href="#">${ item.author4 }</a>
		</li>
		<li>
			<a href="#">${ item.author5 }</a>
		</li>
	
	`;
	
	// 页码
	var box = document.querySelector('.box');
	box.innerHTML += `
		<span class='pagination-sum'>${ item.sumEnd }</span>
	`;
	var lastA = box.querySelector('.btn>a.last');
	lastA.innerText = item.sumLast;
});

//购物车
(function() {
	var pcount = Cookies.get('pcount');
	var productCount = document.querySelector('.top-title-right>a span.product-count');
	productCount.innerText = typeof pcount === 'undefined'? 0 : pcount ;
})();

var data = JSON.parse(sessionStorage.getItem('data'));
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

// 排序
var orderDir = 'asc'; //asc表示升序, desc表示降序
var orderKey = 'price'; //price表示按价格
(function() {
	var spans = document.querySelectorAll('.comprehensive-top>ul>li>span');
	spans.forEach(function(span, i) {
		span.onclick = function() {
			if(this.classList.contains('active')) {
				if(orderDir === 'desc') this.classList.remove(orderDir);
				orderDir = orderDir === 'asc' ? 'desc' : 'asc';
				this.classList.add(orderDir);
				this.classList.toggle('asc', orderDir === 'asc');
			}
			else {
				orderKey = this.dataset.key;
				spans.forEach(function(item) { item.classList.remove('active'); });
				this.classList.add('active');
			}
			sortList();
		};
	});
})();

function sortList() {
	var list = [];
	var product = productList.filter(function(item) { return item.cid === cid; });
	for(var i = 0; i < 4; i++) {
		product.forEach(function(item) {
			list.push(item);  
		});
	}
	list.sort(function(a,b) {
		return orderDir === 'asc' ? a[orderKey] - b[orderKey] : b[orderKey] - a[orderKey];
	});
	document.querySelector('.comprehensive-product>ul.list-ul').innerHTML = '';
	list.forEach(function(item) {
		document.querySelector('.comprehensive-product>ul.list-ul').innerHTML += `
			<li>
				<a href='../detail/detail.html?did=${ item.id }'>
					<img src='${ item.image }' alt='' />
					<span class='span-text'>${ item.name }</span>
					<span class='span-author'>${ item.author }</span>
					<span class='span-price'>￥${ item.price }</span>
				</a>
			</li>
		`;
	});
	
}










