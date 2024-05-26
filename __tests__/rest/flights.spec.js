const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { getKnex, tables } = require('./../../src/data');
const { withServer } = require('./../helpers');
const config = require('config');

const data = {
  flights: [
    {
      timeframe: '08:00 - 09:00',
      date: '2021-11-22',
      type: 'Training',
      plane: 'OO-EBU',
      departure: 'EBBR',
      arrival: 'EBCI',
    },
    {
      timeframe: '09:00 - 10:00',
      date: '2021-11-22',
      type: 'Training',
      plane: 'OO-VMY',
      departure: 'EBCI',
      arrival: 'EBOS',
    },
    {
      timeframe: '10:00 - 11:00',
      date: '2021-11-22',
      type: 'Training',
      plane: 'OO-VMC',
      departure: 'EBOS',
      arrival: 'EBUL',
    },
  ],
  pilots: [
    {
      fName: 'Lucca',
      lName: 'Van Veerdeghem',
      birthday: '2003-05-02',
      auth0id: config.get('auth.testUser.userId'),
    },
    {
      fName: 'John',
      lName: 'Doe',
      birthday: '2000-10-02',
      auth0id: 'auth0|60f5b1b2b0bqdfqdsfdq1b',
    },
    {
      fName: 'Jan',
      lName: 'Janssens',
      birthday: '1995-02-10',
      auth0id: 'auth|60f5b1516156841b2b0b1b1b',
    },
  ],
  flightDetails: [
    { PIC: 1, flight: 1 },
    { PIC: 1, CoPilot: 2, flight: 2 },
    { PIC: 2, CoPilot: 3, flight: 3 },
  ],
  planes: [
    { registration: 'OO-EBU', type: 'P28A' },
    { registration: 'OO-VMY', type: 'P28A' },
    { registration: 'OO-VMC', type: 'P28A' },
  ],
};

const dataToDelete = {
  flights: [1, 2, 3],
  pilots: [1, 2, 3],
  flightDetails: [1, 2, 3],
  planes: ['OO-EBU', 'OO-VMY', 'OO-VMC'],
};

describe('flights', () => {
  let request, knex, authHeader;

  withServer(({ knex: k, request: r, authHeader: a }) => {
    knex = k;
    request = r;
    authHeader = a;
  });

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = await getKnex();
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/flights';

  describe('GET /flights', () => {
    beforeAll(async () => {
      await knex(tables.pilot).insert(data.pilots);
      await knex(tables.plane).insert(data.planes);
      await knex(tables.flight).insert(data.flights);
      await knex(tables.flightdetails).insert(data.flightDetails);
    });
    it('should 200 and return a list of flights', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[1]).toEqual({
        id: 1,
        timeframe: '08:00 - 09:00',
        date: '2021-11-21T23:00:00.000Z',
        type: 'Training',
        plane: 'OO-EBU',
        departure: 'EBBR',
        arrival: 'EBCI',
      });

      expect(response.body[0]).toEqual({
        id: 2,
        timeframe: '09:00 - 10:00',
        date: '2021-11-21T23:00:00.000Z',
        type: 'Training',
        plane: 'OO-VMY',
        departure: 'EBCI',
        arrival: 'EBOS',
      });
    });
    it('should 200 and return requested flight', async () => {
      const response = await request.get(url + '/info/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        timeframe: '08:00 - 09:00',
        date: '2021-11-21T23:00:00.000Z',
        type: 'Training',
        plane: 'OO-EBU',
        departure: 'EBBR',
        arrival: 'EBCI',
        PIC: 1,
        CoPilot: null,
        flight: 1,
      });
    });
    it('should 200 and return amount per category', async () => {
      const response = await request.get(url + '/categories/').set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([0,0,2]);
    });
    it('should 200 and return statistics', async () => {
      const response = await request.get(url + '/stats/').set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([0,0,2]);
    });
    it('should 400 and return error message', async () => {
      const response = await request.get(url + '/info/4');
      expect(response.status).toBe(400);
      expect(response.text).toMatch(new RegExp('There is no flight with id 4'));
    });
    it('should 401 and return error message', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(401);
      expect(response.text).toMatch(new RegExp('Not Authorized, please log in'));
    });
    it('should 401 and return error message', async () => {
      const response = await request.get(url + '/categories/');
      expect(response.status).toBe(401);
      expect(response.text).toMatch(new RegExp('Not Authorized, please log in'));
    });
    it('should 401 and return error message', async () => {
      const response = await request.get(url + '/stats/');
      expect(response.status).toBe(401);
      expect(response.text).toMatch(new RegExp('Not Authorized, please log in'));
    });

  });

  describe('POST /flights', () => {
    it('should 200 and return the created flight', async () => {
      const response = await request.post(url).set('Authorization', authHeader).send({
        timeframe: '08:00 - 09:00',
        date: '2021-11-22',
        type: 'Training',
        plane: 'OO-EBU',
        departure: 'EBBR',
        arrival: 'EBCI',
        PIC: 1,
        CoPilot: null,
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
		id:4,
        timeframe: '08:00 - 09:00',
        date: '2021-11-21T23:00:00.000Z',
        type: 'Training',
        plane: 'OO-EBU',
        departure: 'EBBR',
        arrival: 'EBCI',
      });
    });
    it('should 200 and return the created flight', async () => {
      const response = await request.post(url).set('Authorization', authHeader).send({
        timeframe: '08:00 - 09:00',
        date: '2021-11-22',
        type: 'Training',
        plane: 'OO-EBU',
        departure: 'EBBR',
        arrival: 'EBCI',
        PIC: 1,
        CoPilot: '',
      });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
		id:5,
        timeframe: '08:00 - 09:00',
        date: '2021-11-21T23:00:00.000Z',
        type: 'Training',
        plane: 'OO-EBU',
        departure: 'EBBR',
        arrival: 'EBCI',
      });
	});
      it('should 401 and return error message', async () => {
        const response = await request.post(url).send({
          timeframe: '08:00 - 09:00',
          date: '2021-11-22',
          type: 'Training',
          plane: 'OO-EBU',
          departure: 'EBBR',
          arrival: 'EBCI',
          PIC: 1,
          CoPilot: null,
        });
        expect(response.status).toBe(401);
        expect(response.text).toMatch(new RegExp('Not Authorized, please log in'));
      });
      it('should 403 and return error message', async () => {
        const response = await request.post(url).set('Authorization', authHeader).send({
          timeframe: '08:00 - 09:00',
          date: '2021-11-22',
          type: 'Training',
          plane: 'OO-EBU',
          departure: 'EBBR',
          arrival: 'EBCI',
          PIC: null,
          CoPilot: null,
        });
        expect(response.status).toBe(403);
        expect(response.text).toMatch(new RegExp('You need at least one pilot'));
      });
      it('should 403 and return error message', async () => {
        const response = await request.post(url).set('Authorization', authHeader).send({
          timeframe: '08:00 - 09:00',
          date: '2021-11-22',
          type: 'Training',
          plane: 'OO-EBU',
          departure: 'EBBR',
          arrival: 'EBCI',
          PIC: 2,
          CoPilot: null,
        });
        expect(response.status).toBe(403);
        expect(response.text).toMatch(new RegExp('You are not allowed to create a flight for this pilot'));
      });
    });
    describe('PUT /flights', () => {
      it('should 200 and return the updated flight', async () => {
        const response = await request
          .put(url + '/update/')
          .set('Authorization', authHeader)
          .send({
            id: 1,
            timeframe: '08:00 - 09:00',
            date: '2021-11-22',
            type: 'Local',
            plane: 'OO-EBU',
            departure: 'EBBR',
            arrival: 'EBCI',
            PIC: 1,
            CoPilot: null,
          });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: 1,
          timeframe: '08:00 - 09:00',
          date: '2021-11-21T23:00:00.000Z',
          type: 'Local',
          plane: 'OO-EBU',
          departure: 'EBBR',
          arrival: 'EBCI',
          PIC: 1,
          CoPilot: null,
          flight: 1,
        });
      });
      it('should 403 and return error message', async () => {
        const response = await request
          .put(url + '/update/')
          .set('Authorization', authHeader)
          .send({
            id: 6,
            timeframe: '08:00 - 09:00',
            date: '2021-11-22',
            type: 'Local',
            plane: 'OO-EBU',
            departure: 'EBBR',
            arrival: 'EBCI',
            PIC: 1,
            CoPilot: null,
          });
        expect(response.status).toBe(403);
        expect(response.text).toMatch(new RegExp('There is no flight with id 6'));
      });
      it('should 401 and return error message', async () => {
        const response = await request.put(url + '/update/').send({
          id: 1,
          timeframe: '08:00 - 09:00',
          date: '2021-11-22',
          type: 'Local',
          plane: 'OO-EBU',
          departure: 'EBBR',
          arrival: 'EBCI',
          PIC: 1,
          CoPilot: null,
        });
        expect(response.status).toBe(401);
        expect(response.text).toMatch(new RegExp('Not Authorized, please log in'));
      });
      it('should 403 and return error message', async () => {
        const response = await request
          .put(url + '/update/')
          .set('Authorization', authHeader)
          .send({
            id: 3,
            timeframe: '08:00 - 09:00',
            date: '2021-11-22',
            type: 'Local',
            plane: 'OO-EBU',
            departure: 'EBBR',
            arrival: 'EBCI',
            PIC: null,
            CoPilot: null,
          });
        expect(response.status).toBe(403);
        expect(response.text).toMatch(new RegExp('You need at least one pilot'));
      });
    });
    describe('DELETE /flights', () => {
      it('should 204 and return the deleted flight', async () => {
        const response = await request.delete(url + '/1').set('Authorization', authHeader);
        expect(response.status).toBe(204);
      });
      it('should 403 and return error message', async () => {
        const response = await request.delete(url + '/6').set('Authorization', authHeader);
        expect(response.status).toBe(403);
        expect(response.text).toMatch(new RegExp('There is no flight with id 6'));
      });
      it('should 403 and return error message', async () => {
        const response = await request.delete(url + '/3').set('Authorization', authHeader);
        expect(response.status).toBe(403);
        expect(response.text).toMatch(new RegExp('You are not allowed to delete this flight'));
      });
      it('should 401 and return error message', async () => {
        const response = await request.delete(url + '/1');
        expect(response.status).toBe(401);
        expect(response.text).toMatch(new RegExp('Not Authorized, please log in'));
      });
    });
  });