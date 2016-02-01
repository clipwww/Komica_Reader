$(function(){
	var $main = $("#main");
	var $header_span = $("header span");
	var imageSmall_col = new Array();

	$("#menu-icon").click(openMenuLeft);

	$("#menu-open-layer, #menu-list li").click(openMenuLeft);

	$("#menu-bottom-icon").click(openMenuBottom);

	$("#menu-list li[name]").click(readKanban);

	$main.on({
		click:readComments
	},"a.noneA");//end on

	function openMenuLeft(){
		$("#menu-left").toggleClass('menu-close');
		$("#menu-icon").toggleClass('menu-icon-X');
		$("#menu-open-layer").toggleClass('hide');
	}//end function

	function openMenuBottom(){
		$("footer").toggleClass('menu-close');
	}//end function

	function readKanban(){
		var kanban_url = $(this).attr("name");
		var komicaHTML = "";
		$main.text("");

		$.get( kanban_url , function(data){
			var data_res = $(data.responseText);
			var data_res_title = data_res[10]; //標頭的位置，含有標題；文章列表等
			var data_res_form = data_res[12]; //發表文章表單的位置
			var data_res_contents = data_res[14]; //主區塊

			var kanban_title = $(data_res_title).find("h1").text();
			$header_span.text(kanban_title); //改變header的文字

			$(data_res_contents).find(".threadpost").each(function(i){
				var $this = $(this);
				var id = $this.attr("id"); //發文數字的ID
				var imageSmall = $this.find("img").attr("src"); //縮圖的網址
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
			$main.append(komicaHTML);
		});//end get
	}//end function readKanban

	function readComments(){
		event.preventDefault();//阻止點擊a的預設功能
		var comm_url = $(this).attr("href");
		var komicaHTML = "";
		$main.text("");
		imageSmall_col.length=0;

		$.get( comm_url, function(data){
			var data_res = $(data.responseText);
			var data_res_form = data_res[12]; //發表文章表單的位置
			var data_res_contents = data_res[14]; //主區塊

			console.log(data_res_contents)
			$(data_res_contents).find("#threads > div").each(function(i){
				var $this = $(this);
				
				if( $this.attr("class") === "threadpost"){ //代表是發文者
					var comm_title = $this.find("span.title").text();//標題
					$header_span.text(comm_title);

					var name = $this.find("label").text();
					name = name.slice( name.indexOf("[") );//發文時間與亂數ID
					var id = $this.attr("id"); //發文數字ID
					var imageSmall = $this.find("img").attr("src");//縮圖的網址
					var imageBig = $this.find("img").parent("a").attr("href")//原圖的網址
					imageSmall_col.push( imageSmall );//蒐集縮圖網址
					var quote = $this.find(".quote").text(); //內文

					komicaHTML += "<div class=\"row\">";
					komicaHTML += "<div id=\""+ id +"\" class=\"col-sm-12 threadpostBox\">";
					komicaHTML += "<p>"+ name +"</p>";
					komicaHTML += "<p class=\"title\">【島民No. "+ id.replace("r","")+"】"+ comm_title +"</p>";
					komicaHTML += "<a href=\""+ imageBig +"\" target=\"_blank\">"
					komicaHTML += "<img src=\""+ imageSmall +"\" alt=\""+id+"的附圖\"/></a>"
					komicaHTML += "<p class=\"quote\">"+ quote +"</p>"
					komicaHTML += "</div>";

				}else{
					var id = $this.attr("id"); //發文數字ID
					var comm_title = $this.find("span.title").text();//標題
					var name = $this.find("label").html();
					console.log(name);
					name = name.slice( name.indexOf("[") );//發文時間與亂數ID					
					var imageSmall = $this.find("img").attr("src");//縮圖的網址
					var imageBig = $this.find("img").parent("a").attr("href")//原圖的網址
					imageSmall_col.push( imageSmall );//蒐集縮圖網址
					var quote = $this.find(".quote").html(); //內文

					komicaHTML += "<div id=\""+ id +"\" class=\"col-sm-10 replyBox\">";
					komicaHTML += "<p>"+ name +"</p>";
					komicaHTML += "<p class=\"title\">【島民No. "+ id.replace("r","")+"】"+ comm_title +"</p>";
					if( imageBig !== undefined){
						komicaHTML += "<a href=\""+ imageBig +"\" target=\"_blank\">"
						komicaHTML += "<img src=\""+ imageSmall +"\" alt=\""+id+"的附圖\"/></a>"
					}
					komicaHTML += "<p class=\"quote\">"+ quote +"</p>"
					komicaHTML += "</div>";

				}
			})//end each
			komicaHTML += "</div>";

		}).done(function(){
			$main.append(komicaHTML);
		});//end get

	}//end function

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

