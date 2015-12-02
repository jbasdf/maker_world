/*

  Include as client script

  Usage:
  var identifier = 'myname';
  var player = $('#spriteID');
  registerPage(identifier, player);

  see live example at:
  http://upholsterer-calculators-57726.bitballoon.com/

  repo @
  https://github.com/nick-benoit14/CacheMakersHTMLGame
*/

var  registerPage = function(name, playerReference){
  //TODO: Get world url automatically, border arrow animations, check for page size change

  $(document).ready(function(){

/*                                 Push Data to Database                                    */

       var worldsUrl = "https://shining-torch-8736.firebaseio.com/worlds3";
       var worldsRef = new Firebase(worldsUrl);
       var myWorldRef = new Firebase(worldsUrl + '/' + name);

     //TODO: Figure out how to get page refernces

       var adj_pages = {
       'top':'http://google.com',
       'bottom':'http://google.com',
       'left':'http://google.com',
       'right':'http://google.com'};

       var pageData = {"nick":{ //Will overwrite old instance if URL changes
         "worldUrl":"http://upholsterer-calculators-57726.bitballoon.com/",
         'adj_worlds':adj_pages
       }};

      worldsRef.set(pageData); //update Firebase

    /*                                 Add arrow button links to page                                   */

      var setButtons = function(direction, url){ //create html string with correct position and link to adjacent pages
        var imgsrc = "https://cdn4.iconfinder.com/data/icons/arrows-9/100/arrow-9-512.png";
        var html = "<a href='" + url + "' style='position:absolute;";

        if(direction == 'top') html += "left:" + parseInt($('body').width() / 2 - 50) +  "px;top:" + 0 + "px" + "' id='topButton'><img style='height:100px; width:100px; transform:rotate(90deg);' src='" + imgsrc + "' ></a>";
        else if(direction == 'left') html += "left:" + 0 +  "px;top:" + parseInt($('body').height() / 2 - 50) + "px" + "' id='leftButton'><img style='height:100px; width:100px; transform:rotate(0deg);' src='" + imgsrc + "' ></a>";
        else if(direction == 'right') html += "left:" +  parseInt($('body').width() - 100) +  "px;top:" + parseInt($('body').height() / 2 - 50) + "px" + "' id='rightButton'><img style='height:100px; width:100px; transform:rotate(180deg);' src='" + imgsrc + "' ></a>";
        else if(direction == 'bottom') html += "left:" + parseInt($('body').width() / 2 - 50) +  "px;top:" + parseInt($('body').height() - 100) + "px" + "' id='bottomButton'><img style='height:100px; width:100px; transform:rotate(270deg);' src='" + imgsrc + "' ></a>";

        return html;
      }

      Object.keys(adj_pages).forEach(function(key){ //add html reference to each adjacent world
        //Set Button for top, bottom, left, right
        var html = setButtons(key, adj_pages[key]);
        $('body').append(html);
      });


    /*                                   Player Methods                                             */

      var detectEdge = function(player, edgeCallback){
        var tolerance = 20; //give yourself some room

        if(parseInt(player.css('left')) <= 0 - tolerance) edgeCallback('L');  //left edge
        else if(parseInt(player.css('left')) >= $('body').width() - tolerance) edgeCallback('R'); //right edge
        else if(parseInt(player.css('top')) <= 0 - tolerance) edgeCallback('U'); //top edge
        else if(parseInt(player.css('top')) >= $('body').height() + tolerance) edgeCallback('D');
      }

      var onEdge = function(direction){ // Do when edge is reached
        if(direction == 'L'){    //Navigate to world
          window.clearInterval(intRef);
          $('#leftButton')[0].click();}
        else if(direction == 'R'){
          window.clearInterval(intRef);
          $('#rightButton')[0].click();}
        else if(direction == 'U'){
          window.clearInterval(intRef);
          $('#topButton')[0].click();}
        else if(direction == 'D'){
          window.clearInterval(intRef);
          $('#bottomButton')[0].click();}
      }

     var intRef = window.setInterval( function(){detectEdge( playerReference, onEdge ); }, 250); //poll for edges

     var distanceTo = function(player, object){ //return distance from player to object
          var x = parseInt(player.css('left')) - parseInt(object.css('left'));
          var y = parseInt(player.css('top')) - parseInt(object.css('top'));
          return Math.sqrt((x * x) + (y * y));
     }
  });
}
