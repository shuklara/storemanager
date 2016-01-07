db.stores.find().forEach(function (store) {
  var cats = store.categories;
  for (var key in cats) {
    var cat = cats[key];
    var path = db.categories.findOne({catId: key}).path;
    cat.path = path;
    for (var key1 in cat.products) {
      var prod = cat.products[key1];
      prod.categoryPath = path;
    }
  }
  db.stores.update({_id: store._id}, store);
});
