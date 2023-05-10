var currentTime = new Date();
var sec = currentTime.getSeconds();
var min = currentTime.getMinutes();	
var hr = currentTime.getHours();

document.getElementById("secondHand").style.transform = 'rotate(' + ( sec *6) + 'deg)';
document.getElementById("minuteHand").style.transform = 'rotate(' + ( min *6 ) + 'deg)';
document.getElementById("hourHand").style.transform = 'rotate(' + ( hr * 30 + ( min * .5 ) ) + 'deg)';


//let ding1 = new Audio('/sounds/ding1.wav');
//let ding2 = new Audio('/sounds/ding2.wav');

var bezel = document.getElementById("bezel");

var secondHand = document.getElementById("secondHand");
var minuteHand = document.getElementById("minuteHand");
var hourHand = document.getElementById("hourHand");
var labelText = document.getElementById("labeltext");

var settings = document.getElementById("settings");
var modalContent = document.getElementById("myModalContent");
var help = document.getElementById("help");
var menuBtn = document.getElementById("menubtn");
var closeBtn = document.getElementById("closebtn");
var fullBtn = document.getElementById("fullScreen");
var helpBtn = document.getElementById( "helpbtn");
var reset = document.getElementById("reset");
var resetIcon = document.getElementById("resetIcon");
var cancelButton = document.getElementById("cancelB");
var submitButton = document.getElementById("submitB");
var clockDiv = document.getElementById("clockDiv")

menuBtn.onclick = function() {
  settings.classList.add("openModal");
  modalContent.classList.add("openContent");
  menuBtn.style.visibility = "hidden";
  closeBtn.style.visibility = "visible";
}

closeBtn.onclick = function() {
  settings.classList.remove("openModal");
  modalContent.classList.remove("openContent");
  menuBtn.style.visibility = "visible";
  closeBtn.style.visibility = "hidden";
}

helpBtn.onclick = function() {
  console.log("clicked");
  help.classList.toggle("openHelp");
}



fullBtn.onclick = function() {

//  clockDiv.style.backgroundColor = "transparent";
  if ( document.fullscreenEnabled || /* Standard syntax */
       document.webkitFullscreenEnabled || /* Safari */
      document.msFullscreenEnabled/* IE11 */ ){ 
		  if (clockDiv.requestFullscreen) {
			clockDiv.requestFullscreen();
		  } else if (clockDiv.webkitRequestFullscreen) { /* Safari */
			clockDiv.webkitRequestFullscreen();
		  } else if (clockDiv.msRequestFullscreen) { /* IE11 */
			clockDiv.msRequestFullscreen();
		  }

      } 
}

submitButton.disabled = true;

console.log("here2");


var rads = [42, 32, 18];

var nPicks = 7; // one more than number of colors... 0 gives blank face
var nSwaths = 12; // number of possible swaths

var aSwaths = Array(nSwaths).fill(["","","","",""]);
var aRings = Array(nSwaths).fill(["","",""]);
var pattern = ["","","","","","",""];
var pat = ["","","","","","",""];
var times = ["","","","","","",""];
var timeP = ["","","","","", "", ""];
var colorP = ["","","","","", "", ""];
var tool = ["","","","","", "", ""];
var colors = ["#fffff0", "", "", "", "", ""];
var diff = ["", "", "", "", ""];
var mins = ["","","","","", "", ""];
var hrs = ["","","","","", "", ""];
var mint = ["","","","","", "", ""];
var hrt = ["","","","","", "", ""];
var difft = ["","","","",""];
var rows = ["","","","","","",""];
var labelP = ["","","","","","",""]; 
var labels = ["","","","","","",""];
var enable = ["","","","","","",""];
var labelPaths = ["","","","","","",""];

var rings = new Array();
var minRad = (-1) * Math.PI / 30;


var status = -1;

var popout = 0;

var count=0;

var modalState = -1;

for (let j=0; j < nSwaths; j++){
   
	aRings[j] = [ document.getElementById("alarm"+j+"A"), document.getElementById("alarm"+j+"B"), document.getElementById("alarm"+j+"C") ]; 

}



for (let i=0; i < nPicks; i++){

  pattern[i] = document.getElementById("Pattern"+i);
  pat[i] = "url(#Pattern"+i+")";
  colorP[i] = document.getElementById("color"+i);
  timeP[i] = document.getElementById("time"+i);
  tool[i] = document.getElementById("tool"+i);
  rows[i] = document.getElementById("row"+i);
  labelP[i] = document.getElementById("label"+i);
  labelPath[i] = document.getElementById("label"+i) 

}

 clearSwath(0);
  clearSwath(1);
  clearSwath(2);
  clearSwath(3);
  clearSwath(4);
  clearSwath(5);
  clearSwath(6);
  clearSwath(7);
  clearSwath(8);
  clearSwath(9);

getData(['status', 'times', 'colors', 'labels', 'diff'], 
   function(data) { 
	var temp = 0;
	if ( !(isNaN(data.status)) ){
	status = data.status;
	count = status;
	times = data.times;
	colors = data.colors;
	labels = data.labels;
	for  (let i=0; i < times.length; i++){
 	  if (times[i] != ""){  
	    timeP[i].value = times[i];
	    timeP[i].removeAttribute("disabled");
	    colorP[i].value = colors[i];
	    labelP[i].value = labels[i];
  	    temp = times[i].split(':');
	    hrs[i] = parseInt(temp[0]);
	    hrt[i] = hrs[i];
	    mins[i] = parseInt(temp[1]);
	    mint[i] = mins[i];
	    if (i>0){
               diff[i] = timeDiff(hrs[0],mins[0],hrs[i],mins[i]);
	    }

	    if (i < (nPicks - 1)) {
	      timeP[i+1].removeAttribute("disabled");
	      timeP[i+1].style.display = "table-row";	
	    }	
	  }
	}

         diff[0] = timeDiff( hrs[0],mins[0],hr,min );

         if ( Math.max(...diff.slice(1,nPicks)) > 2 ){
            rads = [42, 32, 18];
         } else if ( Math.max(...diff.slice(1,nPicks)) > 1 ){
            rads = [42, 22, 18];
         } else {
            rads = [42, 32, 18];
         }
		
	if (status > 0){
  	  setupAlarms();
	  updateSeconds();
	}

} 
});


enable[0] = function (){

    var temp = timeP[0].value.split(':');
    hrt[0] = parseInt(temp[0]);
    mint[0] = parseInt(temp[1]);

 
    timeP[1].addEventListener ("input", enable[1]);
    timeP[1].removeAttribute("disabled");

    if (count > 0) {
      temp2 = timeDiff(hrt[0],mint[0],hrt[1],mint[1]); 	
      if ( temp2 <= 0){
	 tool[1].innerHTML = "This time must be after the Start time" ;
 	 tool[1].style.visibility = "visible";
         submitButton.disabled = true;   
      }else{
	tool[1].style.visibility = "";
	 diff[1] = temp2;
         submitButton.disabled = false;   
      }
    }else {



    }


//    if (status === 0)
//	timeP[1].value = timeP[0].value;

}

enable[1] = function (){

    var temp = timeP[1].value.split(':');
    hrt[1] = parseInt(temp[0]);	
    mint[1] = parseInt(temp[1]);
    var temp2 =	timeDiff(hrt[0],mint[0],hrt[1],mint[1]); 	
    submitButton.disabled = false;

//document.getElementById("test").value = hrt[0] + "," + mint[0] + "," + hrt[1] + "," + mint[1];

    if (count > 1) {
        var temp3 = timeDiff(hrt[1],mint[1],hrt[2],mint[2]);
	submitButton.disabled = false;
	if ( temp2 <= 0){
	   tool[1].style.visibility = "visible";
	   tool[1].innerHTML = "This time must be after the Start time" ;
           submitButton.disabled = true;   
	} else if(temp2 > 3){
	   tool[1].style.visibility = "visible";
	   tool[1].innerHTML = "The Max duration is 3 hours" ;
           submitButton.disabled = true;   
	} else{
 	   tool[1].style.visibility = "";
	}      
	if ( temp3 <= 0){
	   tool[2].innerHTML = "This time must be after the previous time" ;
	   tool[2].style.visibility = "visible";
           submitButton.disabled = true;   
	}
    }else if ( ( temp2 < 3 ) && ( temp2 > 0 )){
	timeP[2].removeAttribute("disabled");
	timeP[2].addEventListener ("input", enable[2]);
	rows[2].style.display = "table-row";
	tool[1].style.visibility = "";
        diff[1] = temp2;

	count = Math.max(status,1);

    } else{
	if (temp2 > 0)
	  tool[1].innerHTML = "The Max duration is 3 hours" ;
	else
	  tool[1].innerHTML = "This time must be after the Start Time" ;

	tool[1].style.visibility = "visible";
	submitButton.disabled = true;
    }
}

enable[2] = function (){

    var temp = timeP[2].value.split(':');
    hrt[2] = parseInt(temp[0]);	
    mint[2] = parseInt(temp[1]);
    temp1 =	timeDiff(hrt[0],mint[0],hrt[2],mint[2]);
    var temp2 =	timeDiff(hrt[1],mint[1],hrt[2],mint[2]);
    submitButton.disabled = false;


    if (count > 2) {
        var temp3 = timeDiff(hrt[2],mint[2],hrt[3],mint[3]);
	submitButton.disabled = false;
	if ( temp2 <= 0){
	   tool[2].style.visibility = "visible";
	   tool[2].innerHTML = "This time must be after the Start time" ;
           submitButton.disabled = true;   
	} else if(temp2 > 3){
	   tool[2].style.visibility = "visible";
	   tool[2].innerHTML = "The Max duration is 3 hours" ;
           submitButton.disabled = true;   
	} else{
 	   tool[2].style.visibility = "";
	}      
	if ( temp3 <= 0){
	   tool[3].innerHTML = "This time must be after the previous time" ;
	   tool[3].style.visibility = "visible";
           submitButton.disabled = true;   
	}
    }else if ( ( temp1 < 3 ) && ( temp1 > 0 ) && ( temp2 > 0 )){
	timeP[3].removeAttribute("disabled");
	timeP[3].addEventListener ("input", enable[3]);
	rows[3].style.display = "table-row";
	tool[2].style.visibility = "";
        diff[2] = temp1;

	count = Math.max(status,2);
    }else{
	if ( temp2 > 0)
	  tool[2].innerHTML = "The Max duration is 3 hours" ;
	else
	  tool[2].innerHTML = "This time must be after the previous time" ;

	tool[2].style.visibility = "visible";
	submitButton.disabled = true;
	diff[2] = "";
    }

}

enable[3] = function(){

    var temp = timeP[3].value.split(':');
    hrt[3] = parseInt(temp[0]);	
    mint[3] = parseInt(temp[1]);
    temp1 =	timeDiff(hrt[0],mint[0],hrt[3],mint[3]);
    var temp2 =	timeDiff(hrt[2],mint[2],hrt[3],mint[3]);
    submitButton.disabled = false;


    if (count > 3) {
        var temp3 = timeDiff(hrt[2],mint[2],hrt[3],mint[3]);
	submitButton.disabled = false;
	if ( temp2 <= 0){
	   tool[3].style.visibility = "visible";
	   tool[3].innerHTML = "This time must be after the Start time" ;
           submitButton.disabled = true;   
	} else if(temp2 > 3){
	   tool[3].style.visibility = "visible";
	   tool[3].innerHTML = "The Max duration is 3 hours" ;
           submitButton.disabled = true;   
	} else{
 	   tool[3].style.visibility = "";
	}      
	if ( temp3 <= 0){
	   tool[4].innerHTML = "This time must be after the previous time" ;
	   tool[4].style.visibility = "visible";
           submitButton.disabled = true;   
	}

    }else if ( ( temp1 < 3 ) && ( temp1 > 0 ) && ( temp2 > 0 )){
	timeP[4].removeAttribute("disabled");
	timeP[4].addEventListener ("input", enable[4]);
	rows[4].style.display = "table-row";
	tool[3].style.visibility = "";
	diff[3] = temp1;

	count = Math.max(status,3);
    }else{
	if ( temp2 > 0)
	  tool[3].innerHTML = "The Max duration is 3 hours" ;
	else
	  tool[3].innerHTML = "This time must be after the previous time" ;

	tool[3].style.visibility = "visible";
	submitButton.disabled = true;
	diff[3] = "";
    }

}

enable[4] =function(){

    var temp = timeP[4].value.split(':');
    hrt[4] = parseInt(temp[0]);	
    mint[4] = parseInt(temp[1]);
    diff[4] =	timeDiff(hrt[0],mint[0],hrt[4],mint[4]);
    var temp2 =	timeDiff(hrt[3],mint[3],hrt[4],mint[4]);


    if ( ( diff[4] < 3 ) && ( diff[4] > 0 ) && ( temp2 > 0 )){
	timeP[5].removeAttribute("disabled");
	timeP[5].addEventListener ("input", enable[5]);
	rows[5].style.display = "table-row";
	tool[4].style.visibility = "";
	count = Math.max(status,4);
	submitButton.disabled = false;
    }else{
	if ( temp2 > 0)
	  tool[4].innerHTML = "The Max duration is 3 hours" ;
	else
	  tool[4].innerHTML = "This time must be after the previous time" ;

	tool[4].style.visibility = "visible";
	submitButton.disabled = true;
	diff[4] = "";
    }

}


enable[5] =function(){

    var temp = timeP[5].value.split(':');
    hrt[5] = parseInt(temp[0]);	
    mint[5] = parseInt(temp[1]);
    diff[5] =	timeDiff(hrt[0],mint[0],hrt[5],mint[5]);
    var temp2 =	timeDiff(hrt[4],mint[4],hrt[5],mint[5]);


    if ( ( diff[5] < 3 ) && ( diff[5] > 0 ) && ( temp2 > 0 )){
	timeP[6].removeAttribute("disabled");
	timeP[6].addEventListener ("input", enable[6]);
	rows[6].style.display = "table-row";
	tool[5].style.visibility = "";
	count = Math.max(status,5);
	submitButton.disabled = false;
    }else{
	if ( temp2 > 0)
	  tool[5].innerHTML = "The Max duration is 3 hours" ;
	else
	  tool[5].innerHTML = "This time must be after the previous time" ;

	tool[5].style.visibility = "visible";
	submitButton.disabled = true;
	diff[5] = "";
    }

}

enable[6] =function(){

    var temp = timeP[6].value.split(':');
    hrt[6] = parseInt(temp[0]);	
    mint[6] = parseInt(temp[1]);
    diff[6] =	timeDiff(hrt[0],mint[0],hrt[6],mint[6]);
    var temp2 =	timeDiff(hrt[5],mint[5],hrt[6],mint[6]);


    if ( ( diff[6] < 3 ) && ( diff[6] > 0 ) && ( temp2 > 0 )){
	tool[6].style.visibility = "";
	count = Math.max(status,6);
	submitButton.disabled = false;
    }else{
	if ( temp2 > 0)
	  tool[6].innerHTML = "The Max duration is 3 hours" ;
	else
	  tool[6].innerHTML = "This time must be after the previous time" ;

	tool[6].style.visibility = "visible";
	submitButton.disabled = true;
	diff[6] = "";
    }

}



timeP[0].addEventListener ("input", enable[0]);
timeP[1].addEventListener ("input", enable[1]);
timeP[1].removeAttribute("disabled");
rows[1].style.display = "table-row";

if (count > 0){
  timeP[2].addEventListener ("input", enable[2]);
  timeP[2].removeAttribute("disabled");
  rows[2].style.display = "table-row";
}
if (count > 1){
  timeP[3].addEventListener ("input", enable[3]);
  timeP[3].removeAttribute("disabled");
  rows[3].style.display = "table-row";
}
if (count > 2){
  timeP[4].addEventListener ("input", enable[4]);
  timeP[4].removeAttribute("disabled");
  rows[4].style.display = "table-row";
}
if (count > 3){
  timeP[5].removeAttribute("disabled");
  rows[5].style.display = "table-row";
  timeP[5].addEventListener ("input", enable[5]);
}
if (count > 4){
  timeP[6].addEventListener ("input", enable[6]);
  timeP[6].removeAttribute("disabled");
  rows[6].style.display = "table-row";
}





/*

menu.onclick = function() {

//  modal.style.display = "none";

//  if ( modal.style.display == "block" ){
//    modal.style.display = "none";
//  } else{
//    modal.style.display = "block";
    timeP[0].addEventListener ("input", enable[0]);
    timeP[1].addEventListener ("input", enable[1]);
    timeP[1].removeAttribute("disabled");
    rows[1].style.display = "table-row";

    if (count > 0){
      timeP[2].addEventListener ("input", enable[2]);
      timeP[2].removeAttribute("disabled");
      rows[2].style.display = "table-row";
    }
    if (count > 1){
      timeP[3].addEventListener ("input", enable[3]);
      timeP[3].removeAttribute("disabled");
      rows[3].style.display = "table-row";
    }
    if (count > 2){
      timeP[4].addEventListener ("input", enable[4]);
      timeP[4].removeAttribute("disabled");
      rows[4].style.display = "table-row";
    }
    if (count > 3){
      timeP[5].removeAttribute("disabled");
      rows[5].style.display = "table-row";
      timeP[5].addEventListener ("input", enable[5]);
    }
    if (count > 4){
      timeP[6].addEventListener ("input", enable[6]);
      timeP[6].removeAttribute("disabled");
      rows[6].style.display = "table-row";
    }
//  }

}
*/

reset.onclick = function() {
	
	resetAll();
}

resetIcon.onclick = function() {
	resetAll();
}


cancelButton.onclick = function() {   //close the modal when cancel is clicked
//  settings.style.display = "none";
	getData(['status', 'popout', 'times', 'colors', 'labels', 'diff'], 
	  function(data) { 
		var temp = 0;
		if ( !(isNaN(data.status)) ){
			status = data.status;
			count = status;
			popout = data.popout;
			times = data.times;
			colors = data.colors;
			labels = data.labels;
			for  (let i=0; i < times.length; i++){
			  if (times[i] != ""){  
				timeP[i].value = times[i];
				timeP[i].removeAttribute("disabled");
				colorP[i].value = colors[i];
				labelP[i].value = labels[i];
				temp = times[i].split(':');
				hrs[i] = parseInt(temp[0]);
				hrt[i] = hrs[i];
				mins[i] = parseInt(temp[1]);
				mint[i] = mins[i];
				if (i>0){
					   diff[i] = timeDiff(hrs[0],mins[0],hrs[i],mins[i]);
				}

				if (i < (nPicks - 1)) {
				  timeP[i+1].removeAttribute("disabled");
				  timeP[i+1].style.display = "table-row";	
				}	
			  }
			}

			diff[0] = timeDiff( hrs[0],mins[0],hr,min );

			if ( Math.max(...diff.slice(1,nPicks)) > 2 ){
				rads = [42, 32, 18];
			} else if ( Math.max(...diff.slice(1,nPicks)) > 1 ){
				rads = [42, 22, 18];
			} else {
				rads = [42, 32, 18];
			}

			if (status > 0){
			  setupAlarms();
			  updateSeconds();
			}
	    } 
	  });
}


submitButton.onclick = function() {

  for (let i = 0; i < nPicks; i++) {
//    timeP[i].removeEventListener ("input", enable[i]);
    times[i] = timeP[i].value;
    hrs[i] = hrt[i];
    mins[i] = mint[i];
    colors[i] = colorP[i].value;
    labels[i] = labelP[i].value;
    pattern[i].style.stroke = colors[i];
  }


  if ( Math.max(...diff.slice(1,nPicks)) > 2 ){
     rads = [42, 32, 18];
  } else if ( Math.max(...diff.slice(1,nPicks)) > 1 ){
     rads = [42, 22, 18];
  } else {
     rads = [42, 32, 18];
  }

  diff[0] = timeDiff( hrs[0],mins[0],hr,min );
  	
  setData( "times", times );
  setData( "colors", colors );
  setData( "labels", labels );
  setData( "diff", diff );
  
  status = count;

 //   document.getElementById("test").value = "status =" + status;

  setData( "status", status );

  if (times[0] === ""){ 
//	timeP[0].addEventListener ("input", enable[0]);
	tool[0].animate([
		{visibility: 'visible', opacity: 1},
		{visibility: 'hidden', opacity: 0}],
		{ duration: 5000} );

  }else {
        setupAlarms();
        updateSeconds();

//       chrome.runtime.sendMessage({greeting: "update"}, function(response) {
//                 document.getElementById("test").value = response.farewell;
//      });
  }
}



function clearSwath ( num )
{
  var Aref = document.getElementById("alarm"+num+"A");
  var Bref = document.getElementById("alarm"+num+"B");
  var Cref = document.getElementById("alarm"+num+"C");

  bezel.style.fill = "#e0e2e4" ;
  bezel.style.opacity = 1 ;

  for (let i = 0; i < 3; i++ ){
  
    aRings[num][i].style.stroke = "ivory" ;
    aRings[num][i].style.fill = "ivory" ;
    aRings[num][i].style.opacity = 0;
  
  }

}

function updateSeconds() {	

//    document.getElementById("test").value = "status =" + status;

	var nowTime = new Date();
	sec = nowTime.getSeconds();
	min = nowTime.getMinutes();	
	hr = nowTime.getHours();

        diff[0] = timeDiff( hrs[0],mins[0],hr,min );


	secondHand.style.transform = 'rotate(' + ( sec *6) + 'deg)';
   	minuteHand.style.transform = 'rotate(' + ( min *6 ) + 'deg)';
	hourHand.style.transform = 'rotate(' + ( hr * 30 + ( min * .5 ) ) + 'deg)';

	if (status > 0){
	  updateSwath();
 	  updateBezel();
	}
}


function updateBezel() {

  if ( diff[0] >= 0 ){
    let j = 1;
    
    while ( j < nPicks ){
      if( (hr < hrs[j]) || ( (hr == hrs[j]) && (min < mins[j]) ) ){
  	  bezel.style.fill = colors[j] ;
	  labelText.innerHTML = labels[j];
	  labelText.style.fill = "black";
	  bezel.style.opacity = 0.3 ;
          if ( (min == (mins[j]-1)) && (sec>50) && (sec<60) ){ 
	    if ( (sec%2) === 0 ){
	      bezel.style.opacity = 0.3 ;
	      labelText.style.fill = "black";
	    } else {
	      bezel.style.opacity = 1 ;
	      labelText.style.fill = pickTextColor(colors[j]);
              ding1.play();
	    }
	    if (sec == 59){
	      ding2.play();
	    }
	  }
	  j = nPicks + 1;
       }else{
         j++;  
       }
    }
    if (j == nPicks){
       bezel.style.fill = "#e0e2e4" ;
       labelText.innerHTML = "";
    }
  }
}


function createPath (r, smin, emin){

	var sy = (-1) * r * Math.cos( smin * minRad );
	var sx = (-1) * r * Math.sin( smin * minRad );
	var ey = (-1) * r * Math.cos( emin * minRad );
	var ex = (-1) * r * Math.sin( emin * minRad );

	if ( (((emin-smin) + 60)%60) > 30 ){
		return "M 0 0 L " + sx + " " + sy + " " + "A " +
			r + " " + r + " 0 1 1 " + ex + " " + ey + " z" ;
	} else {
		return "M 0 0 L " + sx + " " + sy + " " + "A " +
			r + " " + r + " 0 0 1 " + ex + " " + ey + " z" ;	
	}
}

function labelPath (r, smin, emin){

	var sy = (-1) * r * Math.cos( smin * minRad );
	var sx = (-1) * r * Math.sin( smin * minRad );
	var ey = (-1) * r * Math.cos( emin * minRad );
	var ex = (-1) * r * Math.sin( emin * minRad );

	return "M 0 0 L " + sx + " " + sy + " " + " z" ;
/*
	
	if ( (((emin-smin) + 60)%60) > 30 ){
		return "M 0 0 L " + sx + " " + sy + " " + " z" ;
	} else {
		return "M 0 0 L " + sx + " " + sy + " " + "A " +
			r + " " + r + " 0 0 1 " + ex + " " + ey + " z" ;	
	} */
}


function timeDiff (startH, startM, endH, endM){

  var minD = endM - startM;
  var hourD = endH - startH;

  if ( hourD < 0){
	hourD += 24;
  }
  if (minD < 0){
	hourD -= 1;
	minD +=60;
  }
  if (minD === 0){
	return hourD;
  } else{
	return hourD + minD/100;
  }

}

var updateClock = setInterval(updateSeconds,1000);





function setupAlarms(){

  let swath = 0;
  let ring = 0;
  let temp = 0;


  for (let j=0; j < nSwaths; j++){
    aSwaths[j] = ["", "", "", "", ""];
  }



  let j = 1;

  while ( j <= count ){
     
    if ( j == 1){
      if (diff[0] < 0){
        temp = 1;
      }else if ( diff[0] < diff[1] ){
        temp = 0;
      }else {
        temp = -1;
      }
    }else{ 
      if (diff[j] < diff[0]){
        temp = -1;
      }else if ( diff[0] >= diff[j-1] ){
         temp = 0;
      }else{
         temp = 1;
      }
    }
    if ( j == 1) {
      if ( diff[1] <= 1){
         aSwaths[swath++] = [j , rads[ring], mins[0], mins[j], temp ];
      } else if ( diff[1] <= 2){
         if ( temp == 0){
            if (diff[0] <= 1){
              aSwaths[swath++] = [j , rads[ring++], mins[0], (mins[0] - 0.1), temp ];
            }else{
              aSwaths[swath++] = [j , rads[ring++], mins[0], (mins[0] - 0.1), -1 ];
            }
         } else{
            aSwaths[swath++] = [j , rads[ring++], mins[0], (mins[0] - 0.1), temp ];
         }
         aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
         aSwaths[swath++] = [j, rads[ring], mins[0], mins[j], temp ];
      } else {
           if ( (temp!==0) || (diff[0] <= 1)){ 
             aSwaths[swath++] = [j, rads[ring++], mins[j-1], (mins[0] - 0.1), temp ];
             aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
             aSwaths[swath++] = [j, rads[ring++], mins[0], (mins[0] - 0.1), temp ];
           }else if (diff[0] <= 2){
             aSwaths[swath++] = [j, rads[ring++], mins[j-1], (mins[0] - 0.1), -1 ];
             aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
             aSwaths[swath++] = [j, rads[ring++], mins[0], (mins[0] - 0.1), temp ];
           }else{
             aSwaths[swath++] = [j, rads[ring++], mins[j-1], (mins[0] - 0.1), -1 ];
             aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
             aSwaths[swath++] = [j, rads[ring++], mins[0], (mins[0] - 0.1), -1 ];
           }
         aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
         aSwaths[swath++] = [j, rads[ring], mins[0], mins[j], temp ];
      }

    }else {
      if ( (diff[j] - Math.floor(diff[j-1]) ) <= 1 ){
         aSwaths[swath++] = [j , rads[ring], mins[j-1], mins[j], temp ];
      }else if (  (diff[j] - Math.floor(diff[j-1]) ) <= 2 ){
         if ( ((diff[0] - Math.floor(diff[j-1]) ) < 1 ) || (temp !=0)){
           aSwaths[swath++] = [j , rads[ring++], mins[j-1], (mins[0] - 0.1), temp ];
         }else{
           aSwaths[swath++] = [j , rads[ring++], mins[j-1], (mins[0] - 0.1), -1 ];
         }
         aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
         aSwaths[swath++] = [j, rads[ring], mins[0], mins[j], temp ];
      }else{ 
         if ( (diff[0] - Math.floor(diff[j-1]) ) <= 1  ){
           aSwaths[swath++] = [j , rads[ring++], mins[j-1], (mins[0] - 0.1), temp ];
           aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
           aSwaths[swath++] = [j, rads[ring++], mins[0], (mins[0] - 0.1), temp ];
         }else if ( (diff[0] - Math.floor(diff[j-1]) ) <= 2 ){
           aSwaths[swath++] = [j , rads[ring++], mins[j-1], (mins[0] - 0.1), -1 ];
           aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
           aSwaths[swath++] = [j, rads[ring++], mins[0], (mins[0] - 0.1), temp ];
         }else {
           aSwaths[swath++] = [j , rads[ring++], mins[j-1], (mins[0] - 0.1), -1 ];
           aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
           aSwaths[swath++] = [j, rads[ring++], mins[0], (mins[0] - 0.1), -1 ];
         }

         aSwaths[swath++] = [0, rads[ring]+1, mins[0], (mins[0] - 0.1), -5 ];
         aSwaths[swath++] = [j, rads[ring], mins[0], mins[j], temp ];
      }


    }

    j++;

  }

//    document.getElementById("test").value = aSwaths.length; 


  for (let k=0; k < aSwaths.length; k++){  
     setSwath(k);
  }
}


function setSwath (j)
{ 


   if (aSwaths[j][0] !== ""){    
     aRings[j][0].style.stroke = colors[aSwaths[j][0]];
     aRings[j][0].style.fill = colors[aSwaths[j][0]];
     aRings[j][0].style.opacity = 1;
     aRings[j][1].style.stroke = colors[aSwaths[j][0]];
     aRings[j][1].style.fill = colors[aSwaths[j][0]];
     aRings[j][1].style.opacity = 0.2;
     aRings[j][2].style.stroke = colors[aSwaths[j][0]];
     aRings[j][2].style.fill = pat[aSwaths[j][0]];
     aRings[j][2].style.opacity = 0.9;

     if ( aSwaths[j][4] === 0 ) {
         aRings[j][0].setAttribute("d", createPath( aSwaths[j][1], min, aSwaths[j][3]));
     } else if ( ( aSwaths[j][4] > 0 ) || (aSwaths[j][4] == -5) ){
         aRings[j][0].setAttribute("d", createPath( aSwaths[j][1], aSwaths[j][2], aSwaths[j][3]));
     } else {
         aRings[j][0].setAttribute("d", createPath( 2, aSwaths[j][2], aSwaths[j][2]));
     }
     aRings[j][1].setAttribute("d", createPath( aSwaths[j][1], aSwaths[j][2], aSwaths[j][3]));
     aRings[j][2].setAttribute("d", createPath( aSwaths[j][1], aSwaths[j][2], aSwaths[j][3]));
   } else{
     clearSwath(j);
   }

}

function updateSwath ()
{ 
   var x = aSwaths.findIndex ( (e, i) => {  return (e[4] === 0)  } );
//    document.getElementById("test").value = x; 

   if (x >= 0){
     if (aSwaths[x][3] == min ){
        aSwaths[x][4] = -1;
        aRings[x][0].setAttribute("d", createPath( 2 , min, aSwaths[x][3]));
        if ( (aSwaths[x+1][4] > 0) || (aSwaths[x+1][4] === 0) ){
           aSwaths[x+1][4] = 0;
        }else if (aSwaths[x+1][4] == -5) {
           aSwaths[x+2][4] = 0;
        }else{
           status = -1;
        }
     } else{
        aRings[x][0].setAttribute("d", createPath( aSwaths[x][1], min, aSwaths[x][3]));
     }
   } else {
     status = -1;
   }
}

function pickTextColor(bgColor) {
  var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
    "black" : "white";
}

function getData( dataNames, callback ){
	let data = {};
	console.log(dataNames);
	for (let key of dataNames ){
		data[key] = JSON.parse(localStorage.getItem(key));
		console.log(key);
		console.log(data[key]);
	}

    callback(data);
	
}

function setData( key, data ){

		localStorage.setItem(key, JSON.stringify(data));
	    console.log(key + "," + JSON.stringify(data));
	
}


function resetAll() {
  
  status = -1;

  tool[0].style.visibility = "";
  timeP[1].setAttribute("disabled","true");


  colors = ["#fffff0", "#00ff00", "#ffff00", "#ffa500", "#ff0000", "#0000ff", "#800080"];
  times = ["","","","","","",""];
  labels = ["","","","","","",""]; 
  mins = ["","","","","","",""];
  mint = ["","","","","","",""];
  hrs = ["","","","","","",""];
  hrt = ["","","","","","",""];
  diff = ["","","","","","",""];
  difft = diff;

  for (let i = 0; i < nPicks; i++) {
    tool[i].style.visibility = "";
    colorP[i].value = colors[i];
    labelP.value = "";
    if (i > 1){
      timeP[i].removeEventListener ("input", enable[i]);
      rows[i].style.display = "none";
    }
    timeP[i].value = "";
  }

  clearSwath(0);
  clearSwath(1);
  clearSwath(2);
  clearSwath(3);
  clearSwath(4);
  clearSwath(5);
  clearSwath(6);
  clearSwath(7);
  clearSwath(8);
  clearSwath(9);



  bezel.style.fill = "#e0e2e4";
  labelText.innerHTML = "";

  count = 0;
  setData( "times", times );
  setData( "colors", colors );
  setData( "status", status );
  setData( "labels", labels );
  setData( "diff", diff );


}


