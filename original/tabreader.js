$(document).ready(function() {
	var i = 0;
    $('#readerenabler').attr('onclick', '');
    $('#readerenabler').attr('style', '');
    $('#readerenabler').html('Reader enabled');
	$('a[href$=".txt"]').each(function(){
		var file = $(this).attr('href');
		$(this).after('&nbsp;<a style="text-decoration:underline; cursor:pointer; color:#FF4500" pos="' + i + '" onclick="gettab(\'' + file + '\', ' + i + ')">[Reader (beta)]</a>&nbsp;');
		i++;
	});
});

function gettab(filename, pos) {
    var adebug = 0; //SET THIS TO 1 TO ENABLE DEBUG

	$('a[pos=' + pos + ']').html(' Preparing tab... ');
	$('a[pos=' + pos + ']').css('color', '#006400');
	$('a[pos=' + pos + ']').attr('onclick', '');
    getDebug("reading file: " + filename, adebug);
	$.ajax({
        url : "./" + filename,
        dataType: "text",
        success : function (txt) {
            getDebug("got file: " + filename, adebug);
            var lines = txt.replace(/ /g, '\xA0').split("\n");
            var introfound = 0;
            var introlastindex;
            var legendstartindex;
            var error = 0;
            var topline = new Array();
            var eindexes = new Array();
            var aindexes = new Array();
            var dindexes = new Array();
            var gindexes = new Array();
            var bindexes = new Array();
            var etindexes = new Array();    

            for (var i = 0, len = lines.length; i < len; i++) {
                //Get introduction text
    			var slashes = lines[i].match(/-/ig) || [];
                var doubleslash = lines[i].match(/=/ig) || [];
                var slashcount = slashes.length + doubleslash.length;
                if (slashcount >= 15) {
                	if (lines[i].charAt(0) == 'e' || lines[i].charAt(0) == 'E' || lines[i].charAt(0) == '|' || lines[i].charAt(0) == '\xA0') {
                		introlastindex = i - 2; //Remove two lines to get intro last index
                        getDebug('Got intro index at line ' + introlastindex, adebug);
                		etindexes[0] = i; //First e line
                        getDebug('Got first e line at line ' + etindexes[0], adebug);
                		topline[0] = i-1; //First topline
                        getDebug('Got first top line at line ' + topline[0], adebug);
                        introfound = 1;
                		break;
                	}
                }
            }   

            if (introfound == 0) {
                error = 1;
                getDebug('Error at line ' + i + ', cannot find first tab line. Line returned: ' + lines[i], adebug);
            } else if (error == 0) { //Get tab lines if introduction properly found
            	var lastindex = etindexes[0];
            	var j = 1;

            	while(lastindex < lines.length) {
                    getDebug("Starting iteration " + j, adebug);
    	        	if (error == 0) {
    		        	for (var i = 1; i <= 5; i++) { //Trying to find 6 other lines
                            if (lines[lastindex+i] != undefined) {
        		        		var slashes = lines[lastindex+i].match(/-/ig) || [];
                                var doubleslash = lines[lastindex+i].match(/=/ig) || [];
                                var slashcount = slashes.length + doubleslash.length;
        		        		if (slashcount >= 15) {
        		        			switch (i) {
        		        				case 1:
        		        					bindexes.push(lastindex+i);
        		        					break;
        		        				case 2:
        		        					gindexes.push(lastindex+i);
        		        					break;
        		        				case 3:
        		        					dindexes.push(lastindex+i);
        		        					break;
        		        				case 4:
        		        					aindexes.push(lastindex+i);
        		        					break;
        		        				case 5:
        		        					eindexes.push(lastindex+i);
                                            getDebug('Got E line: ' + lines[lastindex+i], adebug);
        		        					break;
        		        				default:
        		        					break; //Nothing to do
        		        			}
        		        		} else if (i == 5) {
        		        			error = 1 //The following 5 lines should be tab lines. If not sure throw error
        		        			getDebug('Error at line ' + (lastindex+i) + ', last checked line is not a tab. Given line: ' + lines[lastindex+i], adebug);
        		        			break;
        		        		}
                            } else {
                                break;
                            }
    		        	}	   

    		        	lastindex = lastindex+6; //We are now 6 lines after the e line	  

    		        	for (var i = 0; i < 5; i++) { //Check for another e line in the next 5 lines
                            if (lines[lastindex+i] != undefined) {
        		        		var slashes = lines[lastindex+i].match(/-/ig) || [];
        	            		var doubleslash = lines[lastindex+i].match(/=/ig) || [];
                                var slashcount = slashes.length + doubleslash.length;
                                if (slashcount >= 15) {
        	            			if (lines[lastindex+i].charAt(0) == 'e' || lines[lastindex+i].charAt(0) == 'E' || lines[lastindex+i].charAt(0) == '|' || lines[lastindex+i].charAt(0) == '-') {
        			            		getDebug('Found new e line: ' + lines[lastindex+i], adebug);
                                        //Check for fake tab line
                                        var slashes = lines[lastindex+i+1].match(/-/ig) || [];
                                        if (slashes.length < 5) {
                                            getDebug("Was a fake tab line, consider tab done", adebug);
                                            legendstartindex = lastindex+i;
                                            lastindex = lines.length + 1;
                                            break;
                                        }
                                        etindexes.push(lastindex+i);                                    
                                        topline.push(lastindex+i-1);
                                        lastindex = lastindex+i;
        			            		break;
        			            	}
                                } else if (i == 4 && lastindex+i >= (lines.length-50)) {
                                    getDebug('Tablature section ended at line ' + (lastindex+i), adebug);
                                    legendstartindex = lastindex+i; //Suppose we are done at this point
                                    lastindex = lines.length + 1; //Kill the while loop
                                    break;
        	            		} else if (i == 4) {
                                    error = 1;
                                    lastindex = lines.length + 1; //Kill the while loop, error.
                                    getDebug('Error at end of file. Cannot find last tab line', adebug);
                                    break;
                                }
                            } else {
                                //line overflow. Consider no legend
                                legendstartindex = lastindex-1;
                                lastindex = lines.length + 1; //Kill the while loop
                            }
    		        	}
    		        } else {
    		        	lastindex = lines.length + 1; //Kill the while loop, error.
    		        }

                    j++;
    	        }
            }   

            if (error == 0) {
                if (adebug == 1) {
                	getDebug('Success', adebug);
                	getDebug('Introduction ends at line ' + introlastindex, adebug);
                	getDebug('Legend starts at line ' + legendstartindex, adebug);
                	getDebug('top lines: ', adebug);
                 	for(var i = 0; i<=topline.length; i++) {
                		getDebug(topline[i] + ", ", adebug);
                	}       	
                	getDebug('e lines: ', adebug);
                	for(var i = 0; i<=etindexes.length; i++) {
                		getDebug(etindexes[i] + ", ", adebug);
                	}
                	getDebug('b lines: ', adebug);
                	for(var i = 0; i<=bindexes.length; i++) {
                		getDebug(bindexes[i] + ", ", adebug);
                	}
                	getDebug('g lines: ', adebug);
                	for(var i = 0; i<=gindexes.length; i++) {
                		getDebug(gindexes[i] + ", ", adebug);
                	}
                	getDebug('d lines: ', adebug);
                	for(var i = 0; i<=dindexes.length; i++) {
                		getDebug(dindexes[i] + ", ", adebug);
                	}
                	getDebug('a lines: ', adebug);
                	for(var i = 0; i<=aindexes.length; i++) {
                		getDebug(aindexes[i] + ", ", adebug);
                	}
                	getDebug('E lines: ', adebug);
                	for(var i = 0; i<=eindexes.length; i++) {
                		getDebug(eindexes[i] + ", ", adebug);
                	}
                }

                //Concatenate lines and format
                var trimsize = 0; //How much to trim topline
                var temptopline = "";
                var introstring = "";
                var legendstring = "";
                var topstring = "";
                var etstring = "";
                var bstring = "";
                var gstring = "";
                var dstring = "";
                var astring = "";
                var estring = "";

                for (var i = 0; i <= etindexes.length; i++) {
                    trimsize = 0;
                    if (etindexes[i] != undefined) {
                        if (lines[etindexes[i]].charAt(0) == "e" || lines[etindexes[i]].charAt(0) == "E") {
                            lines[etindexes[i]] = lines[etindexes[i]].substring(1);
                            trimsize++;
                        }

                        if (lines[etindexes[i]].substr(-2) == "|\r" && lines[etindexes[i]].substr(-3) != "||\r" ) {
                            lines[etindexes[i]] = lines[etindexes[i]].slice(0, -2);
                            lines[etindexes[i]] = lines[etindexes[i]] + "\r";
                            getDebug("Got line ending with |, trimming to " + lines[etindexes[i]], adebug);
                        }
                        
                        etstring += lines[etindexes[i]];
                    }
                    if (topline[i] != undefined) {
                        var strlength = lines[etindexes[i]].length; 
                        getDebug('String length is: ' + strlength + '. Topline length is: ' + lines[topline[i]].length + '. Padding with ' + (strlength-lines[topline[i]].length) + ' spaces.', adebug);
                        //Will need to cut spaces - trimming first letters
                        temptopline = lines[topline[i]];

                        if (trimsize != 0) {
                            getDebug("Started trimming " + trimsize + " characters from topline " + lines[topline[i]], adebug);
                            var trimtotal = 0;

                            for (var j = 0; j<=10; j++) {
                                if (trimtotal == trimsize) {
                                    break;
                                }

                                if (temptopline.charAt(j) == "\xA0") {
                                    getDebug("Trimmed a '" + temptopline.charAt(j) + "' at position " + j + " in topline " + lines[topline[i]], adebug);
                                    temptopline = temptopline.substr(0,j) + temptopline.substr(j+1,temptopline.length-j+1);
                                    getDebug("Trimmed result: " + temptopline, adebug);
                                    trimtotal++;
                                }

                                if (j == 10) {
                                    getDebug("Couldn't trim enough lines at topline " + lines[topline[i]], adebug);
                                }
                            }
                        }
                        
                        if ((strlength-lines[topline[i]].length) < 0) {
                            getDebug('Error - topline size is bigger than e line. This is not implemented yet', adebug);
                            error = 1;
                            $('a[pos=' + pos + ']').html(' Tab not yet compatible! ');
                            $('a[pos=' + pos + ']').css('color', 'red');
                            break;
                        }

                        topstring += temptopline.padRight(strlength, "\xA0"); 
                    }
                }

                for (var i = 0; i <= bindexes.length; i++) {
                    if (bindexes[i] != undefined) {
                        if (lines[bindexes[i]].charAt(0) == "b" || lines[bindexes[i]].charAt(0) == "B") {
                            lines[bindexes[i]] = lines[bindexes[i]].substring(1);
                        }

                        if (lines[bindexes[i]].substr(-2) == "|\r" && lines[bindexes[i]].substr(-3) != "||\r" ) {
                            lines[bindexes[i]] = lines[bindexes[i]].slice(0, -2);
                            lines[bindexes[i]] = lines[bindexes[i]] + "\r";
                        }

                        bstring += lines[bindexes[i]];
                    }
                }

                for (var i = 0; i <= gindexes.length; i++) {
                    if (gindexes[i] != undefined) {
                        if (lines[gindexes[i]].charAt(0) == "g" || lines[gindexes[i]].charAt(0) == "G") {
                            lines[gindexes[i]] = lines[gindexes[i]].substring(1);
                        }

                        if (lines[gindexes[i]].substr(-2) == "|\r" && lines[gindexes[i]].substr(-3) != "||\r" ) {
                            lines[gindexes[i]] = lines[gindexes[i]].slice(0, -2);
                            lines[gindexes[i]] = lines[gindexes[i]] + "\r";
                        }

                        gstring += lines[gindexes[i]];
                    }
                }

                for (var i = 0; i <= dindexes.length; i++) {
                    if (dindexes[i] != undefined) {
                        if (lines[dindexes[i]].charAt(0) == "d" || lines[dindexes[i]].charAt(0) == "D") {
                            lines[dindexes[i]] = lines[dindexes[i]].substring(1);
                        }

                        if (lines[dindexes[i]].substr(-2) == "|\r" && lines[dindexes[i]].substr(-3) != "||\r" ) {
                            lines[dindexes[i]] = lines[dindexes[i]].slice(0, -2);
                            lines[dindexes[i]] = lines[dindexes[i]] + "\r";
                        }

                        dstring += lines[dindexes[i]];
                    }
                }

                for (var i = 0; i <= aindexes.length; i++) {
                    if (aindexes[i] != undefined) {
                        if (lines[aindexes[i]].charAt(0) == "a" || lines[aindexes[i]].charAt(0) == "A") {
                            lines[aindexes[i]] = lines[aindexes[i]].substring(1);
                        }

                        if (lines[aindexes[i]].substr(-2) == "|\r" && lines[aindexes[i]].substr(-3) != "||\r" ) {
                            lines[aindexes[i]] = lines[aindexes[i]].slice(0, -2);
                            lines[aindexes[i]] = lines[aindexes[i]] + "\r";
                        }

                        astring += lines[aindexes[i]];
                    }
                }

                for (var i = 0; i <= eindexes.length; i++) {
                    if (eindexes[i] != undefined) {
                        //Support dropped D mode
                        if (lines[eindexes[i]].charAt(0) == "e" || lines[eindexes[i]].charAt(0) == "E" || lines[eindexes[i]].charAt(0) == "d" || lines[eindexes[i]].charAt(0) == "D" || lines[eindexes[i]].charAt(0) == "F") {
                            lines[eindexes[i]] = lines[eindexes[i]].substring(1);
                        }

                        if (lines[eindexes[i]].substr(-2) == "|\r" && lines[eindexes[i]].substr(-3) != "||\r" ) {
                            lines[eindexes[i]] = lines[eindexes[i]].slice(0, -2);
                            lines[eindexes[i]] = lines[eindexes[i]] + "\r";
                        }

                        estring += lines[eindexes[i]];
                    }
                }

                for (var i = 0; i <= introlastindex; i++) { 
                    if (lines[i] != undefined) {
                        introstring += lines[i] + "<br>";
                    }
                }

                for (var i = legendstartindex; i <= lines.length; i++) { 
                    if (lines[i] != undefined) {
                        legendstring += lines[i] + "<br>";
                    }
                }

                if (error == 0) {
                    $('body').html('<a href="./app_index.htm" style="font-weight:bold">Return to Classtab</a><br><hr><br><div"><pre>' + introstring + '</pre><br><div id="scrolltab" style="overflow: scroll;"><pre style="white-space: nowrap;">' + topstring + '<br>' + etstring + '<br>' + bstring + '<br>' + gstring + '<br>' + dstring + '<br>' + astring + '<br>' + estring + '</pre><br><br></div><br><button id="tabbtn" type="button" onclick="scrollTab(0, ' + adebug + ')" style="line-height:100%; width:120px; margin-left:5px; margin-top:2px; margin-right:2px; height:60px; font-size:12px; font-weight:bold">Start scrolling</button>&nbsp;Scroll for <input type="number" name="tabtime" style="width:100px" value="40"></input>&nbsp;seconds total<br><br><pre>' + legendstring + '</pre></div>');
                    window.scrollTo(0, 0);
                }

            } else {
            	$('a[pos=' + pos + ']').html(' Tab not yet compatible! ');
    			$('a[pos=' + pos + ']').css('color', 'red');
            }
        }
    }); 
}

function scrollTab(isanimated, adebug) {
    if (isanimated == 0) {
        var time = $('input[name="tabtime"]').val()*1000;
        var percentscrolled = 100;
        if ($('div#scrolltab').scrollLeft() != 0) {
            percentscrolled = 100-($('div#scrolltab').scrollLeft()/document.getElementById('scrolltab').scrollWidth)*100;
        }
        getDebug("Current position: " + $('div#scrolltab').scrollLeft() + " and inverted calculated percentage: " + percentscrolled, adebug);
        $('div#scrolltab').animate({
            scrollLeft: document.getElementById('scrolltab').scrollWidth //- $('div#scrolltab').scrollLeft()
        }, { "duration": (time*(percentscrolled/100)), "easing": "linear" });
        $('#tabbtn').html('Stop scrolling');
        $('#tabbtn').attr('onclick', 'scrollTab(1)');
    } else {
        $('div#scrolltab').stop();
        $('#tabbtn').html('Start scrolling');
        $('#tabbtn').attr('onclick', 'scrollTab(0)');
    }
}

function getDebug(string, debug) {
    if (debug == 1) {
        console.log(string);
    }
}

String.prototype.padRight = function(l,c) {return this+Array(l-this.length+1).join(c||" ")}
