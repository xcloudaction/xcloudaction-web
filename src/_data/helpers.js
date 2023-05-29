module.exports = {
  currentYear() {
    const today = new Date();
    return today.getFullYear();
  }
};


module.exports = {
  currentDate() {
     
    return new Date().toISOString().slice(0,10);
  }
};
