(()=>{$(function(){var canvas=document.getElementById("duration-day");canvas.width=$("#duration-day").width();var context=canvas.getContext("2d");var W=canvas.width;var H=canvas.height;var gridX=4;var gridY=4;var colors=Array.from(new Array(5),()=>radomHex());var durVal=0.1;function Particle(x,y){this.x=x;this.y=y;this.color=colors[Math.floor(Math.random()*colors.length)];this.futurRadius=randomInt(1,1.1);this.radius=1.1;this.dying=false;this.base=[x,y];this.drawParticle=function(){if(this.radius<this.futurRadius&&this.dying===false){this.radius+=durVal;}else{this.dying=true;}
if(this.dying){this.radius-=durVal;}
context.save();context.fillStyle=this.color;context.beginPath();context.arc(this.x,this.y,this.radius,Math.PI*2,false);context.closePath();context.fill();context.restore();if(this.y<0||this.radius<1){this.x=this.base[0];this.y=this.base[1];this.dying=false;}};}
function Shape(text,size,x,y){var that=this;this.text=text;this.size=size;this.x=x;this.y=y;this.placement=[];function getValue(that2){context.textAlign="center";context.font=that2.size+"px arial";context.fillText(that2.text,that2.x,that2.y);var iData=context.getImageData(0,0,W,H);var buffer=new Uint32Array(iData.data.buffer);for(var i=0;i<H;i+=gridY){for(var j=0;j<W;j+=gridX){if(buffer[i*W+j]){var particle=new Particle(j,i);that2.placement.push(particle);}}}}
function init2(){getValue(that);}
init2();}
function duration(moment2){var startDate=moment2("2020-08-20 00:00:00");var endDate=moment2();var diffTime=moment2.duration(endDate.format("x")-startDate.format("x"));var day=diffTime.days();var hours=diffTime.hours();var minutes=diffTime.minutes();var second=diffTime.seconds();return "运行"+day+"天"+hours+"小时"+minutes+"分"+second+"秒";}
function drawFrame(){context.clearRect(0,0,W,H);var word=new Shape(duration(moment),60,W/2,H/2);window.requestAnimationFrame(drawFrame);context.clearRect(0,0,W,H);for(var i=0;i<word.placement.length;i++){word.placement[i].drawParticle();}}
function randomInt(min,max){return min+Math.random()*(max-min+1);}
function radomHex(){return "#"+(Math.random()*16777215<<0).toString(16);}
function init(){drawFrame();}
init();});})();