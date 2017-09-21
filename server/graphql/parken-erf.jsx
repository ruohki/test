import request from 'request';
import _ from 'lodash';

import { parseString } from 'xml2js';

const getParkData = () => {
  return new Promise( (resolve, reject) => {
    request("http://www.erfurt.de/sve/pls/info.xml", { method: 'get' }, (err, response) => {
      if (err) {
        return reject(err);
      }  
      
      parseString(response.body, (err, result) => {
        if (err) {
          return reject(err);
        }
        let erg = result.parkhaeuser.ph.map(e => {
          let obj = {}
          Object.keys(e).map ((d,i) => {
            obj[d] = e[d][0];
          });

          return obj
        });

        return resolve(erg);
      })
    })
  })
}

export default {
  schema: `
    type Parkhaus {
      id: String
      name: String,
      longname: String,
      oeffnungszustand: String,
      status: String,
      zeitpunkt: String,
      tendenz: String,
      belegung: Int,
      kapazitaet: Int
    }
  `,
  resolver: {
    Query: {
      parkData() {
        
        return getParkData();
      }
    }
  }
}