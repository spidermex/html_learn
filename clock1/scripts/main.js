// Global variables
var ctx = document.getElementById('canvas').getContext('2d');
var imageObj = new Image();
var pattern;
imageObj.onload= function () {
   pattern = ctx.createPattern(imageObj, 'repeat');
}
imageObj.src = 'images/wood-pattern.png';

window.onload = init;

function init() {
   var grd;
   //ctx.fillStyle='#BBAAAA';
   // Create gradient
   grd = ctx.createLinearGradient(18.000, 0.000, 282.000, 300.000);

   // Add colors
   grd.addColorStop(0.000, 'rgba(0, 0, 0, 0.000)');
   grd.addColorStop(1.000, 'rgba(0, 0, 0, 1.000)');


   // Fill with gradient
   ctx.fillStyle = grd;
  ctx.fillRect(0,0,350,350);


}

function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
   //variables to be used when creating the arrow
   var headlen = 10;
   var angle = Math.atan2(toy-fromy,tox-fromx);
   ctx.save();
   ctx.strokeStyle = color;
   //starting path of the arrow from the start square to the end square and drawing the stroke
   ctx.beginPath();
   ctx.moveTo(fromx, fromy);
   ctx.lineTo(tox, toy);
   ctx.lineWidth = arrowWidth;
   ctx.stroke();
   //starting a new path from the head of the arrow to one of the sides of the point
   ctx.beginPath();
   ctx.moveTo(tox, toy);
   ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
   //path from the side point of the arrow, to the other side point
   ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
   //path from the side point back to the tip of the arrow, and then again to the opposite side point
   ctx.lineTo(tox, toy);
   ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
   //draws the paths created above
   ctx.stroke();
   ctx.restore();
 }

function clock(){
   var now = new Date();
   ctx.save();
   ctx.fillStyle='#BBAAAA';
   ctx.shadowBlur=2;
   ctx.shadowOffsetX=2;
   ctx.shadowOffsetY=1;
   ctx.shadowColor="black";

   //ctx.scale(0.85,0.85);
   //ctx.fillRect(0,0,350,350);

   ctx.translate(175,175);
   ctx.beginPath();
   ctx.arc(0,0,148,0,Math.PI*2,true);
   ctx.fill();

   ctx.strokeStyle = "black";
   ctx.fillStyle = "brown";
   ctx.font="oblique bold 24px Times New Roman";
   ctx.strokeText("MyCLock",-45,-50);
   //ctx.fillText("MyCLock",-40,-50);
   ctx.strokeText(now.toLocaleDateString(),-45,50);
//   ctx.fillText(now.toLocaleDateString(),-40,50);
   ctx.lineCap = "round";

   // Hour marks
   ctx.save();
   ctx.font="bold 24px Times New Roman";
   for (var i=0;i<12;i++){
      ctx.lineWidth = 8;
      //ctx.strokeStyle = '#325FA2';
      ctx.strokeStyle = 'maroon';
      ctx.beginPath();
      ctx.rotate(Math.PI/6);
      ctx.moveTo(100,0);
      ctx.lineTo(110,0);
      ctx.stroke();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      if (i>=9) {
         ctx.strokeText(i+1,-13,-121);
         ctx.fillText(i+1,-13,-121);
      } else {
         ctx.strokeText(i+1,-7+i/4,-121);
         ctx.fillText(i+1,-7+i/4,-121);
      }
   }
   ctx.restore();

   // Minute marks
   ctx.save();
   ctx.strokeStyle = "grey";
   ctx.lineWidth = 5;
   for (i=0;i<60;i++){
     if (i%5!=0) {
       ctx.beginPath();
       ctx.moveTo(108,0);
       ctx.lineTo(112,0);
       ctx.stroke();
     }
     ctx.rotate(Math.PI/30);
   }
   ctx.restore();

   var sec = now.getSeconds();
   var min = now.getMinutes();
   var hr  = now.getHours();
   var grd;
   hr = hr>=12 ? hr-12 : hr;
   ctx.rotate(-Math.PI/2);

   // write Hours
   ctx.save();
   ctx.lineCap = "butt";
   ctx.rotate( hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec )
   ctx.lineWidth = 9;
   drawArrow(ctx,-20,0,83,0,"black");
   ctx.restore();

   // write Minutes
   ctx.save();
   ctx.lineCap = "butt";
   ctx.rotate( (Math.PI/30)*min + (Math.PI/1800)*sec )
   ctx.lineWidth = 6;
   drawArrow(ctx,-28,0,112,0,"black")
   ctx.restore();

   // Write seconds
   ctx.save();
   ctx.rotate(sec * Math.PI/30);
   //ctx.strokeStyle = "#D40000";
   //ctx.fillStyle = "#D40000";
   ctx.strokeStyle = "brown";
   ctx.fillStyle = "maroon";
   ctx.lineWidth = 2;
   ctx.beginPath();
   ctx.moveTo(-30,0);
   ctx.lineTo(85,0);
   ctx.stroke();
   ctx.beginPath();
   ctx.arc(0,0,10,0,Math.PI*2,true);
   ctx.fill();
   ctx.beginPath();
   ctx.arc(95,0,8,0,Math.PI*2,true);
   ctx.stroke();
   ctx.moveTo(102,0);
   ctx.lineTo(113,0);
   ctx.stroke();
   ctx.fillStyle = "rgba(0,0,0,0)";
   ctx.arc(0,0,3,0,Math.PI*2,true);
   ctx.fill();
   ctx.restore();

   // Draw clock frame
   ctx.shadowBlur=0;
   ctx.shadowColor="rgba(0,0,0,0)";
   ctx.strokeStyle = pattern;
   ctx.beginPath();
   ctx.lineWidth = 18;
   ctx.arc(0,0,148,0,Math.PI*2,true);
   ctx.stroke();
   ctx.beginPath();
   ctx.strokeStyle = "black";
   ctx.lineWidth = 1;
   ctx.arc(0,0,157,0,Math.PI*2,true);
   ctx.arc(0,0,139,0,Math.PI*2,true);
   ctx.stroke();
   ctx.restore();

   window.requestAnimationFrame(clock);
}

    window.requestAnimationFrame(clock);
