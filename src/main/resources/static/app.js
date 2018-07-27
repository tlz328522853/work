angular.module('env', []);
angular.module('recovery', []);
angular.module('shipment', []);
angular.module('advert', []);
angular.module('advertising', []);
angular.module('management', []);
angular.module('app', ['env','recovery','shipment','advert',"advertising",'management']);