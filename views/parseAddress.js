
module.exports = function (address) {
    var arr = address.split('=');
    if (arr.length > 1) {
      return arr[1].split('&')[0];
    } else {
      return arr[0].split('&')[0];
    }
}
