let imageList=new Array(0);

document.addEventListener('DOMContentLoaded', function(){
	var dropArea=document.getElementById("dropArea");
	var imageNames=document.getElementById("addedImages");
	
	dropArea.addEventListener('dragover',function (event){
		event.preventDefault();
		event.stopPropagation();
	});

	dropArea.addEventListener('drop',function(event){
		event.preventDefault();
		event.stopPropagation();
		
		var files=event.dataTransfer.files; //これはオブジェクト
		if(files.length==0){
			return false;
		}else{
			Reset();
			
			Array.from(files).forEach(function(f){
				imageNames.textContent+=f.name+"\n";
				imageList.push(f);
			});
		}
	});
});

function Resize(){
	if(imageList.length==0){
		alert("Please upload image");
		return false;
	}
	
	var rate=parseInt(document.getElementById('resizePercentage').value)/100;
	var tagetType=document.getElementById("targetType").value;
	var promises=[]; // 各画像の処理のPromiseを格納する配列
	
	imageList.forEach(function(file){
		if(file.type.startsWith('image/')){
			var reader=new FileReader();
			reader.onload=function(event){
				var img=new Image();
				var imageDataUrl=event.target.result;
				
				var canvas=document.createElement('canvas');
				var context=canvas.getContext('2d');
				img.onload=function(){
					var newWidth=Math.round(img.width*rate);
					var newHeight=Math.round(img.height*rate);

					canvas.width=newWidth;
					canvas.height=newHeight;

					context.drawImage(img,0,0,newWidth,newHeight);
					
					var extension="image/"+tagetType;
					if(tagetType=="Default"){
						extension=file.type;
					}
					
					canvas.toBlob(function(blob){
						var url=URL.createObjectURL(blob);
						var a=document.createElement('a');
						a.href=url;
						var fileName=file.name.split('.').slice(0, -1).join('.')+"_resized."+extension.replace("image/","").replace("jpeg","jpg");
						a.download=fileName;
						a.click();
						URL.revokeObjectURL(url);
					},extension);
				};
				
				img.src=imageDataUrl;
			};
			reader.readAsDataURL(file);
		}else{
			alert("Please upload image");
		}
	});
}

function Reset(){
	imageList=new Array(0);
	var imageNames=document.getElementById("addedImages");
	imageNames.textContent="";
}