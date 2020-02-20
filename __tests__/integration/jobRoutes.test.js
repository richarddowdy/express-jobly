const request = require("supertest");
const process = require('process');

const app = require("../../app");
const db = require("../../db");
const Job = require("../../models/jobsModel");
const Company = require("../../models/companiesModel");


process.env.NODE_ENV = "test";


beforeEach(async function () {
  // creating companies so that company_handle exitst
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM companies");

  company1 = await Company.create(
    handle = "handle1",
    name = "NAME1",
    num_employees = 10,
    description = "Description1",
    logo_url = "companylogo1.com"
  )

  company2 = await Company.create(
    handle = "handle2",
    name = "NAME2",
    num_employees = 20,
    description = "Description2",
    logo_url = "companylogo2.com"
  )

  // creating test data for job table

  job1 = await Job.create(
    title = "title1",
    salary = 100,
    equity = 0.01,
    company_handle = "handle1"
  )

  job2 = await Job.create(
    title = "title2",
    salary = 200,
    equity = 0.02,
    company_handle = "handle2"
  )
})

describe("GET /jobs", function () {
  it('gets a list of all jobs', async function () {
    let response = await request(app)
      .get('/jobs');

    expect(response.statusCode).toBe(200);
    expect(response.body.jobs.length).toEqual(2);
  })
})

describe("POST /jobs", function () {
  it('creates a new job', async function () {
    let response = await request(app)
      .post('/jobs')
      .send({
        "title": "title3",
        "salary": 300,
        "equity": 0.03,
        "company_handle": "handle1"
      })

    expect(response.statusCode).toBe(201);
    expect(response.body.job).toBeTruthy()

    let response2 = await request(app)
      .get("/jobs")

    expect(response2.statusCode).toBe(200);
    expect(response2.body.jobs.length).toEqual(3);
  })
})

describe("POST /jobs", function () {
  it('Fails when creating a job without required data', async function () {
    let response = await request(app)
      .post('/jobs')
      .send({
        "salary": 300,
        "equity": 0.03,
        "company_handle": "handle1"
      })
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      "status": 400,
      "message": ["instance requires property \"title\""]
    })
  })
})

describe("GET /jobs/:id", function () {
  it('gets a single job', async function () {
    let response = await request(app)
      .get(`/jobs/${job1.id}`)

    let { id, ...jobInfoWithoutId } = job1;
    expect(response.statusCode).toBe(200);
    expect(response.body.job).toEqual({...jobInfoWithoutId, date_posted: expect.any(String)});
  })
})

describe("GET /jobs/:id", function () {
  it('Fails when getting invalid job', async function () {
    let response = await request(app)
      .get(`/jobs/${job1.id - 1}`)

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      "status": 400,
      "message": "Invalid job id"
    })
  })
})

describe("PATCH /jobs/:id", function(){
  it("update information on existing job", async function(){
    let response = await request(app)
      .patch(`/jobs/${job1.id}`)
      .send({
        "id" : `${job1.id}`,
        "title": "Altered_title1",
        "salary": 1100,
        "equity": 0.11,
      })
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      "job": {
        "id" : expect.any(Number),
        "title": "Altered_title1",
        "salary": 1100,
        "equity": 0.11,
        "company_handle": "handle1",
        "date_posted": expect.any(String)
      }
    })
  })
})

describe("PATCH /jobs/:id", function(){
  it("Fails when updating existing job with incomplete information", async function(){
    let response = await request(app)
      .patch(`/jobs/${job1.id}`)
      .send({
        "id" : `${job1.id}`,
        "salary": 1100,
        "equity": 0.11,
      })
      
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      "status": 400,
      "message": [
        "instance requires property \"title\"",
      ]
    })
  })
})

describe("DELETE /jobs/:id", function(){
  it("Deletes job", async function(){
    const response = await request(app)
      .delete(`/jobs/${job1.id}`)
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      "message": "Job Deleted!"
    })
  })
})




afterAll(async function () {
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM companies");

  await db.end();
})