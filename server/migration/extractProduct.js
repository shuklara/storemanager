db.stores.find().forEach(function(store){
  var products = {};
  for (key in store.categories){
    var cat = store.categories[key];
    for (key1 in cat.products){
      products[key1] = cat.products[key1];
    }
  }
  for (k in products){
    var prod = db.products.findOne({"upc":k});
    if(!prod){
      db.products.insert(products[k]);
    }
  }
});

db.products.find().forEach(function(prod){
  prod.substitutes = [];
  prod.affinities = [];
  db.products.find({"categoryNode": prod.categoryNode}).forEach(function(subs){
    delete subs.substitutes;
    delete subs.affinities;
    prod.substitutes.push({"product":subs,"demand":Math.floor(Math.random() * 80) + 20  });
    prod.affinities.push({"product":subs,"demand":Math.floor(Math.random() * 80) + 1  });
    db.products.update({"upc":prod.upc},prod);
  });
});
