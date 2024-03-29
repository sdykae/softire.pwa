export default class historyClass {
  /**
   * this class require an argument [array of snNeumaticos obj with specific id]
   */
  constructor(arg) {
    this.groupBycodCondicion = this.groupBy(arg, 'codCondicion');
    this.ArrayOfcondicionNU = this.groupBy(this.groupBycodCondicion['NU'], 'codEvento');
  }

  groupBy(objectArray, property) {
    return objectArray.reduce(function(acc, obj) {
      var key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  /**
   * installation Remnant
   */
  get instalationRemnantObj() {
    return this.groupBycodCondicion['NN'][0];
    //returns Array[0], so Object
  }

  get getHistory() {
    return this.groupBycodCondicion;
  }

  /**
   * last Inspection Remnant
   */
  get lastInspectionWhereCondicionNU() {
    // return this.ArrayOfcondicionNU[this.ArrayOfcondicionNU.length -1];
    return this.ArrayOfcondicionNU;
  }
}
