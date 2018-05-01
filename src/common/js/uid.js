let _uid = 0;

export function getUid() {
  if (_uid) {
    return _uid;
  }
  if (!_uid) {
    // 根据世界时 (UTC) 返回时间的毫秒
    // 返回的值是一个三位的数字。不过返回值不总是三位的
    // 如果该值小于 100，则仅返回两位数字
    // 如果该值小于 10，则仅返回一位数字
    const t = (new Date()).getUTCMilliseconds();
    _uid = Math.round(2147483647 * Math.random()) * t % 1e10;
  }
  return _uid;
}
