import request from 'request';
import _ from 'lodash';

const getStationData = () => {
  return new Promise( (resolve, reject) => {
    request("http://luftwache.devbot.de/sensors.json", { method: 'get' }, (err, response) => {
      if (err) {
        return reject(err);
      }  

      const raw = JSON.parse(response.body);
      let sensors = _.filter(Object.keys(raw).map( (k,i) => {
        const obj1 = raw[k];
        const data = obj1[Object.keys(obj1)[0]];
        

        if (data !== undefined) {
          let sensoren = Object.keys(data.sensors).map( (k,i) => {
            const sensor = data.sensors[k].pop();
            
            return Object.assign({ type: k}, sensor);
          });

          data.sensors = sensoren;
        }
        
        return data
      }), e => e !== undefined );

      return resolve(sensors)
    })
  });
}

export default {
  schema: `
    type SensorStation {
      id: ID!
      nickname: String
      version: String
      lastsignal: Int
      system: SensorStation_System
      sensors: [SensorStation_Sensor]
    }

    type SensorStation_System {
      heap: Float
      timestamp: Int
      uptime: Int
      voltage: Float
    }

    type SensorStation_Sensor {
      type: String
      value: Float
      name: String
      unit: String
    }
  `,
  resolver: {
    Query: {
      async sensorStations(root, args) {
        let stationData = await getStationData()
        
        if (args.nickname) {
          stationData = _.filter(stationData, e => e.nickname === args.nickname)
        }

        if (args.id) {
          stationData = _.filter(stationData, e => e.id === args.id)
        }

        if (args.limit) {
          const lim = args.limit < 1 ? 1 : args.limit
          
          stationData = _.slice(stationData, 0, lim)
          
          console.log(stationData)
        }        
        return stationData;
      }
    },
  }
}