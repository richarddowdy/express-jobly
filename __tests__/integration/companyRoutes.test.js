const request = require("supertest");
const process = require('process');

const app = require("../../app");
const db = require("../../db");
const Job = require("../../models/jobsModel");
const Company = require("../../models/companiesModel");

process.env.NODE_ENV = "test";

describe("Company Route Tests", function () {

  let company1;
  let company2;

  beforeEach(async function () {
    await db.query("DELETE FROM jobs");
    await db.query("DELETE FROM companies");

    company1 = await Company.create(
      "handle1",
      "NAME1",
      10,
      "Description1",
      "companylogo1.com"
    )

    company2 = await Company.create(
      "handle2",
      "NAME2",
      20,
      "Description2",
      "companylogo2.com"
    )

    // creating test data for job table

    job1 = await Job.create(
      "title1",
      100,
      0.01,
      "handle1"
    )

    job2 = await Job.create(
      "title2",
      200,
      0.02,
      "handle2"
    )

    job3 = await Job.create(
      "title3",
      300,
      0.03,
      "handle1"
    )
  })

  describe("GET /companies", function () {
    it('gets a list of all companies', async function () {
      let response = await request(app)
        .get('/companies');

      expect(response.statusCode).toBe(200);
      expect(response.body.companies.length).toEqual(2);
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
        .get(`/companies/${company1.handle}`)

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        company: {
          handle: company1.handle,
          name: company1.name,
          num_employees: company1.num_employees,
          description: company1.description,
          logo_url: company1.logo_url,
          jobs: [
            {
              id: job1.id,
              title: job1.title,
              salary: job1.salary,
              equity: job1.equity,
              company_handle: job1.company_handle,
              date_posted: expect.any(String)
            },
            {
              id: job3.id,
              title: job3.title,
              salary: job3.salary,
              equity: job3.equity,
              company_handle: job3.company_handle,
              date_posted: expect.any(String)
            }
          ]
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

  describe("PATCH /companies/:handle", function () {
    it("update information on existing company", async function () {
      let response = await request(app)
        .patch(`/companies/${company1.handle}`)
        .send({
          "handle": `${company1.handle}`,
          "name": "NAME1",
          "num_employees": 10,
          "description": "Altered Description1",
          "logo_url": "Alteredcompanylogo1.com"
        })

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        "company": {
          "handle": `${company1.handle}`,
          "name": "NAME1",
          "num_employees": 10,
          "description": "Altered Description1",
          "logo_url": "Alteredcompanylogo1.com"
        }
      })
    })
  })


  describe("PATCH /companies/:handle", function () {
    it("Fails when updating existing company with incomplete information", async function () {
      let response = await request(app)
        .patch("/companies/handle1")
        .send({
          "description": "Altered Description1",
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

  describe("DELETE /companies/:handle", function () {
    it("Deletes company", async function () {
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
  await db.query("DELETE FROM jobs")
  await db.query("DELETE FROM companies");
  await db.end();
})