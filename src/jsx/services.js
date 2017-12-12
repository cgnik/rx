import fetch from 'isomorphic-fetch';

//import {connect} from 'react-redux';


class Services {
   constructor() {
      this.service = "/go/";
   }

   setService(service) {
      this.service = "/" + service + "/";
   }

   listStandardDeviations() {
      return fetch(this.service + 'standardDeviation').then(sds => sds.json());
   }

   saveStandardDeviation(numbers) {
      let body = JSON.stringify({points: numbers});
      var request = new Request(this.hostify('/standardDeviation'), {
         method: 'POST',
         mode: 'cors',
         body: body
      });
      return fetch(request).then(response => this.shapeResponse(response));
   }

   shapeResponse(response) {
      if (response.status >= 400) {
         throw "Server error";
      } else {
         return response.json();
      }
   }
}

module.exports = new Services()
