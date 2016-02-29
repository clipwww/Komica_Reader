$(function(){
	var $window = $(window);
	var $document = $(document);
	var $body = $("body");
	var $main = $("#main");
	var $jumpImage = $("#jumpImage");
	var $jumpImageS = $("#jumpImageS");
	var $header_span = $("header span");
	var $downSpan = $("#downBtn span");
	var $upSpan = $("#upBtn span");
	var $loader = $(".loader");
	var kanban_list_url;//儲存目前所在看板的主題列表
	var imageBig_col = new Array(); //蒐集原圖用的陣列
	var imageSmall_col = new Array(); //蒐集縮圖用的陣列

	$("#menu-icon").click(openMenuLeft);

	$("#menu-open-layer, #menu-list li").click(openMenuLeft);

	$("#menu-bottom-icon").click(openMenuBottom);
	$("footer span, #main, #menu-icon").click(function(){
		$("footer").addClass('menu-close');
	});

	$("#menu-list li[name]").click(readKanban);

	$main.on({
		click:readComments
	},"a.noneA");//end on

	$main.on({
		click:showImage
	},"a.comm-img");//end on

	$jumpImage.click(function(){
		$jumpImage.fadeOut(500, function(){
			$jumpImage.find("img").attr("src","");
		})
		if( $jumpImageS.is(":hidden") ){
			$body.css({"overflow":""});		
		}
	});//end click

	$("#showAllimg").on({
		click: showAllImage
	},"span.active");//end on

	$jumpImageS.find("button").click(function(){
		$jumpImageS.fadeOut(500);
		$body.css({"overflow":""});
	});//end click

	$jumpImageS.on({
		click:showImage
	},"a");//end on

	// 關於置頂置底按鈕有效與否
    $window.scroll(function() {
    	var BottomH = $("html").height() - $window.height(); //到達最底的高度
    	if( $window.scrollTop() === BottomH ){ //當到達最底時
    		$downSpan.removeClass("active");
    	}else{ //不是最底時則
    		$downSpan.addClass("active");
    	}
    	if( $window.scrollTop() !== 0 ){ //當不是在最頂時
    		$upSpan.addClass("active");
    	}else{
    		$upSpan.removeClass("active");
    	}
    });//end scroll

    //置頂與置底按鈕
	$downSpan.click(function(){
		var BottomH = $("html").height() - $window.height(); //到達最底的高度
    	$("html, body").stop(true,true).animate({"scrollTop":BottomH}, 800);
    });//end click
    $upSpan.click(function(){
    	$("html, body").stop(true,true).animate({"scrollTop":0}, 800);
    });//end click

    //主題列表按鈕
    $("#kanbanList").on({
    	click:readKanBanList
    },"span.active");

    //事件:上一頁
    // $(window).bind("popstate", function (){
    // 	$main.text("").append( history.state );
    // });

	$document.ajaxStart(function(){
		$loader.fadeIn(500);//在資料還沒傳回來之前，先在網頁上顯示"讀取中..."的圖案
	});
	$document.ajaxStop(function(){
		$loader.fadeOut(500);
	});


	function openMenuLeft(){ //開關MENU-LEFT
		$("#menu-left").toggleClass('menu-close');
		$("#menu-icon").toggleClass('menu-icon-X');
		$("#menu-open-layer").toggleClass('hide');
	}//end function

	function openMenuBottom(){ //開關MENU-BOTTOM
		$("footer").toggleClass('menu-close');
	}//end function

	function showImage(){
		event.preventDefault();//阻止點擊a的預設功能
		var imgSrc = $(this).attr("href");
		$jumpImage.children('img').attr("src",imgSrc).end().fadeIn(500);
		$body.css({"overflow":"hidden"});
	}//end function

	function showAllImage(){
		$jumpImageS_div = $jumpImageS.children('div');
		$jumpImageS_div.text(""); //清空上次的瀏覽
		var komicaHTML = "";
		$.each(imageSmall_col, function(i, data){
			komicaHTML += "<a href=\""+ imageBig_col[i] +"\">";
			komicaHTML += "<img src=\""+ data +"\" alt=\"ERROR!\"/></a>";
		})
		$jumpImageS_div.append( komicaHTML );
		$jumpImageS.fadeIn(500);
		$body.css({"overflow":"hidden"});
	}//end function

	function readKanban(){
		$("#showAllimg span").removeClass("active");
		var kanban_url = $(this).attr("name");
		var komicaHTML = "";
		$main.fadeOut(500);
		

		$.get( kanban_url , function(data){
			var $data_res = $(data.responseText);
			var $data_res_form = $data_res.find("#postform"); //發表文章表單的位置

			var kanban_title = $data_res.find("h1").text();
			$header_span.text(kanban_title); //改變header的文字

			var listURL = $data_res.find("[href*=threadlist]").attr("href");
			kanban_list_url = kanban_url + listURL;//組合起來就是主題列表的網址；儲存起來

			$data_res.find(".threadpost").each(function(i){
				var $this = $(this);
				var id = $this.attr("id"); //發文數字的ID
				var imageSmall = $this.find("img").attr("src"); //縮圖的網址
				if( imageSmall.indexOf("http") === -1 ){
					imageSmall = imageSmall.replace("//","http://"); //如果開頭沒http，就補上去
				}
				var title = $this.find("span.title").text(); //發文的標題
				var name = $this.find("label").text();
				name = name.slice( name.indexOf("[") ); //發文的時間與亂數ID
				var quote = $this.find(".quote").text(); //內文
				var hide_text = $this.find("span.warn_txt2").text(); //省略了多少回應的訊息
				var comments_url = kanban_url + "pixmicat.php?res=" + id.replace("r",""); //結合起來就是討亂串的連結

				if( i%3 === 0 ){
					komicaHTML += "<div class=\"row\">";
				}
	        	komicaHTML += "<div class=\"col-sm-4\">";
	        	komicaHTML += "<a class=\"noneA\" href=\""+ comments_url +"\">";
	        	komicaHTML += "<div class=\"commBox\">";
	        	komicaHTML += "<p>島民No. "+ id.replace("r","") +"</p>"
	        	komicaHTML += "<p class=\"title\">" + title + "</p>";
	        	komicaHTML += "<p>" + name + "</p>";
	        	komicaHTML += "<img class=\"img-responsive\" src=\""+ imageSmall +"\" alt=\""+id+"的開板圖\"/>"
	        	komicaHTML += "<p class=\"quote\">" + quote + "</p>";
	        	komicaHTML += "<hr/><p>"+ hide_text +"</p>";
	        	komicaHTML += "</div></a></div>";
	        	if( i%3 === 2  ){
					komicaHTML += "</div>";
				}

			})//end each
			// komicaHTML += "<button id=\"next-page\" class=\"btn btn-lg btn-block btn-priamry\" name=\""+ kanban_url + page +".htm\">下一頁</button>";

		}).done(function(){
			//log_by_read( komicaHTML );
			$main.text("").append(komicaHTML).fadeIn(500);
			$("#kanbanList span").addClass('active')
		});//end get
	}//end function readKanban

	function readComments(){
		event.preventDefault();//阻止點擊a的預設功能
		var comm_url = $(this).attr("href");
		var komicaHTML = "";

		$main.fadeOut(500);	
		imageBig_col.length=0;
		imageSmall_col.length=0;

		$.get( comm_url, function(data){
			var $data_res = $(data.responseText);
			var $data_res_form = $data_res.find("#postform");//發表文章表單的位置

			$data_res.find("#threads > div").each(function(i){
				var $this = $(this);
				
				if( $this.attr("class") === "threadpost"){ //代表是發文者
					var comm_title = $this.find("span.title").text();//標題
					$header_span.text(comm_title);

					var id = $this.attr("id"); //發文數字ID
					var imageSmall = $this.find("img").attr("src");//縮圖的網址
					var imageBig = $this.find("img").parent("a").attr("href")//原圖的網址
					var quote = $this.find(".quote").html(); //內文

					komicaHTML += "<div class=\"row\">";
					komicaHTML += "<div id=\""+ id +"\" class=\"col-sm-12 threadpostBox\">";
					komicaHTML += "<p class=\"title\">【島民No. "+ id.replace("r","")+"】"+ comm_title +"</p>";
					if( imageBig !== undefined){
						if( imageSmall.indexOf("http") === -1 ){
							imageSmall = imageSmall.replace("//","http://");//如果開頭沒http，就補上去
							imageBig = imageBig.replace("//","http://");
						}
						komicaHTML += "<a class=\"comm-img\" href=\""+ imageBig +"\" target=\"_blank\">";
						komicaHTML += "<img src=\""+ imageSmall +"\" alt=\""+id+"的附圖\"/></a>";
						imageBig_col.push( imageBig );//蒐集原圖網址
						imageSmall_col.push( imageSmall );//蒐集縮圖網址
					}
					komicaHTML += "<p class=\"quote\">"+ quote +"</p>";
					komicaHTML += "</div>";

				}else{
					var id = $this.attr("id"); //發文數字ID
					var comm_title = $this.find("span.title").text();//標題				
					var imageSmall = $this.find("img").attr("src");//縮圖的網址
					var imageBig = $this.find("img").parent("a").attr("href")//原圖的網址
					var quote = $this.find(".quote").html(); //內文

					komicaHTML += "<div id=\""+ id +"\" class=\"col-sm-10 replyBox\">";
					komicaHTML += "<p class=\"title\">【島民No. "+ id.replace("r","")+"】"+ comm_title +"</p>";
					if( imageBig !== undefined){
						if( imageSmall.indexOf("http") === -1 ){
							imageSmall = imageSmall.replace("//","http://");//如果開頭沒http，就補上去
							imageBig = imageBig.replace("//","http://");
						}
						komicaHTML += "<a class=\"comm-img\" href=\""+ imageBig +"\" target=\"_blank\">";
						komicaHTML += "<img src=\""+ imageSmall +"\" alt=\""+id+"的附圖\"/></a>";
						imageBig_col.push( imageBig );//蒐集原圖網址
						imageSmall_col.push( imageSmall );//蒐集縮圖網址
					}
					komicaHTML += "<p class=\"quote\">"+ quote +"</p>"
					komicaHTML += "</div>";

				}
			})//end each
			komicaHTML += "</div>";

		}).done(function(){
			//log_by_read( komicaHTML );
			$main.text("").append(komicaHTML).fadeIn(500);
			$("#showAllimg span").addClass("active");
		});//end get

	}//end function

	function readKanBanList(){
		$("#showAllimg span").removeClass("active");
		var komicaHTML = "";
		$main.fadeOut(500);

		var page_of_num = 0;
		var kanban_url = kanban_list_url.slice(0, kanban_list_url.indexOf("pixmicat"));

		$.get( kanban_list_url, {"page":page_of_num}, function(data){

			komicaHTML += getList(data, kanban_url);
			//將資料以及網址丟給function處理，接收回傳的資料

		}).done(function(){

			page_of_num++;//查找下一頁	
			$.get( kanban_list_url, {"page":page_of_num}, function(data){

				komicaHTML += getList(data, kanban_url);

			}).done(function(){
				//log_by_read( komicaHTML );
				$main.text("").append(komicaHTML).fadeIn(500);
			})//end inner get

		});//end get
	}//end function

	function getList(data, kanban_url){
		var komicaHTML = "";
		var $data_res = $(data.responseText);

		var kanban_title = $data_res.find("h1").text();
		$header_span.text(kanban_title); //改變header的文字

		var temp;
		$data_res.find("table:eq(0) tr").each(function(i){
			var $this = $(this);
			if(i){//跳過第一個 因為那只是表格標題
				var this_td = $this.find("td");
				var id = $(this_td[1]).text(); //取得數字ID
				var title = $(this_td[2]).find("a").text(); //取得標題
				var num_of_comm = $(this_td[4]).text() //取得目前回應數
				var time_and_id = $(this_td[5]).text() //取得發文時間與亂數id
				var comments_url = kanban_url + "pixmicat.php?res=" + id; //結合起來就是討論串的連結

				if( i%4 === 1 ){
					komicaHTML += "<div class=\"row\">";
				}
				komicaHTML += "<div class=\"col-sm-3\">";
				komicaHTML += "<a class=\"noneA\" href='"+ comments_url +"'>";
				komicaHTML += "<div class=\"commBox\">";
				komicaHTML += "<p>"+ time_and_id +"</p>";
				komicaHTML += "<p class=\"title\">"+ title + "</p>";
				komicaHTML += "<hr/>回應數："+ num_of_comm;
				komicaHTML += "</div></a></div>"
				if( i%4 === 0 ){
					komicaHTML += "</div>";
				}
			}//end if
			temp = i;
		})//end each
		if(temp%4 !==0 ){
			komicaHTML += "</div>";
		}
		return komicaHTML;		
	}//end function

	// function log_by_read(data){
	// 	 history.pushState(data, "", "index.html");
	// 	 //將資料保存在瀏覽器內部，供上一頁使用；三個參數: 保存的state、這筆紀錄的title、修改網址
	// }
	//log_by_read( $main.html() );
});//end ready

function replyhl(id){
	$("#r"+id).css(
		{
			"box-shadow":"3px 3px 15px black"
		});
	$("#r"+id).siblings().css(
		{
			"box-shadow":""
		});
}//end function

