const sqlForPartialUpdate = require("../../helpers/partialUpdate")

describe("partialUpdate()", () => {

  it("should generate a proper partial update query with just 1 field",
    function () {
      let table = "companies"
      let items = { num_employees: 25};
      let key = "handle";
      let id = 3;

      let result = sqlForPartialUpdate(table, items, key, id)
      console.log(result);
      expect(result).toEqual({query: `UPDATE companies SET num_employees=$1 WHERE handle=$2 RETURNING *`, values: [25, 3]});
    });
});
