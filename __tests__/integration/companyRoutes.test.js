const request = require("supertest");
const process = require('process');

const app = require("../../app");
const db = require("../../db");
const Company = require("../../models/companiesModel");

process.env.NODE_ENV = "test";

describe("Company Route Tests", function () {

  let company1;
  let company2;

  beforeEach(async function () {
    await db.query("DELETE FROM companies");

    company1 = await Company.create(
      handle = "test1",
      name = "TEST1",
      num_employees = 10,
      description = "Description 1",
      logo_url = "companylogo1.com"
    )

    company2 = await Company.create(
      handle = "test2",
      name = "TEST2",
      num_employees = 20,
      description = "Description 2",
      logo_url = "companylogo2.com"
    )
  })

  describe("GET /companies", function () {
    it('gets a list of all companies', async function () {
      let response = await request(app)
        .get('/companies');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "companies": [
          { handle: company1.handle, name: company1.name },
          { handle: company2.handle, name: company2.name }
        ]
      })
    })
  })

  describe("POST /companies", function () {
    it('creates a new company', async function () {
      let response = await request(app)
        .post('/companies')
        .send({
          "handle": "SBY",
          "name": "Subway",
          "num_employees": 1000,
          "description": "Sadwich Vendors",
          "logo_url": "subwaylogo.com"
        })

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        "company": {
          "handle": "SBY",
          "name": "Subway",
          "num_employees": 1000,
          "description": "Sadwich Vendors",
          "logo_url": "subwaylogo.com"
        }
      })
    })
  })

  describe("POST /companies", function () {
    it('Fails when creating a company without required data', async function () {
      let response = await request(app)
        .post('/companies')
        .send({
          "name": "Subway",
          "num_employees": 1000,
          "description": "Sadwich Vendors",
          "logo_url": "subwaylogo.com"
        })
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        "status": 400,
        "message": ["instance requires property \"handle\""]
      })
    })
  })

  describe("GET /companies/:handle", function () {
    it('gets a single company', async function () {
      let response = await request(app)
        .get("/companies/test1")

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "company": {
          "handle": "test1",
          "name": "TEST1",
          "num_employees": 10,
          "description": "Description 1",
          "logo_url": "companylogo1.com"
        }
      })
    })
  })
  
  describe("GET /companies/:handle", function () {
    it('Fails when getting invalid company', async function () {
      let response = await request(app)
        .get("/companies/test4")

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        "status": 400,
        "message": "Invalid company handle"
      })
    })
  })

  describe("PATCH /companies/:handle", function(){
    it("update information on existing company", async function(){
      let response = await request(app)
        .patch("/companies/test1")
        .send({
          "handle": "test1",
          "name": "TEST1",
          "num_employees": 10,
          "description": "Altered Description 1",
          "logo_url": "Alteredcompanylogo1.com"
        })
        
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "company": {
          "handle": "test1",
          "name": "TEST1",
          "num_employees": 10,
          "description": "Altered Description 1",
          "logo_url": "Alteredcompanylogo1.com"
        }
      })
    })
  })
  
  
  describe("PATCH /companies/:handle", function(){
    it("Fails when updating existing company with incomplete information", async function(){
      let response = await request(app)
        .patch("/companies/test1")
        .send({
          "description": "Altered Description 1",
          "logo_url": "Alteredcompanylogo1.com"
        })
        
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        "status": 400,
        "message": [
          "instance requires property \"handle\"",
          "instance requires property \"name\""
        ]
      })
    })
  })

  describe("DELETE /companies/:handle", function(){
    it("Deletes company", async function(){
      const response = await request(app)
        .delete(`/companies/${company1.handle}`)
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "message": "Company Deleted!"
      })
    })
  })

})


afterAll(async function () {
  await db.end();
})