
module.exports = function (address) {
  var new_a;
  if (address.indexOf("youtu.be") != -1) {
    new_a = address.split('/')[3];
  } else if (address.indexOf("youtube.com") != -1) {
    var arr = address.split('=');
    if (arr.length > 1) {
      new_a =  arr[1].split('&')[0];
    } else {
      new_a =  arr[0].split('&')[0];
    }
  } else {
    new_a =  "invalid";
  }
  return new_a;
}
