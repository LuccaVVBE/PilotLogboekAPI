module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pilot logger api',
      version: '1.0',
      summary: 'Pilot logger api provides all data to the pilot logger application',
      description: 'Overview of all routes on the pilot logger rest api.',
      contact: {
        name: 'Lucca Van Veerdeghem',
      },
    },
    servers: [
      {
        url: 'http://localhost:9000/api',
        description: 'Pilot logger API',
      },
    ],
    paths: {
      '/flights/info/{id}': {
        parameters: [
          {
            schema: {
              type: 'integer',
            },
            name: 'id',
            in: 'path',
            required: true,
            description: 'Id of an existing flight.',
          },
        ],
        get: {
          summary: 'Get flight information by flight ID',
          tags: ['Flight'],
          responses: {
            200: {
              description: 'Flight Found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Flight',
                  },
                  examples: {
                    'Get flight 1': {
                      value: {
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
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: '#/components/responses/Validation_Failed',
            },
          },
          operationId: 'get-flights-flightid',
          description: 'Retrieve the information of the flight with matching flightID.',
        },
      },
      "/flights": {
        get: {
          summary: "Get all flights of pilot",
          operationId: "get-flights",
          responses: {
            200: {
              description: "All flights",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    "x-examples": {
                      "Example 1": [
                        {
                          id: 1,
                          timeframe: "08:00 - 09:00",
                          date: "2021-11-21T23:00:00.000Z",
                          type: "Training",
                          plane: "OO-EBU",
                          departure: "EBBR",
                          arrival: "EBCI",
                          PIC: 1,
                          CoPilot: null,
                          flight: 1
                        }
                      ]
                    },
                    items: {
                      $ref: "#/components/schemas/Flight"
                    }
                  },
                  examples: {
                    "All flights": {
                      value: [
                        {
                          id: 1,
                          timeframe: "08:00 - 09:00",
                          date: "2021-11-21T23:00:00.000Z",
                          type: "Training",
                          plane: "OO-EBU",
                          departure: "EBBR",
                          arrival: "EBCI",
                          PIC: 1,
                          CoPilot: null,
                          flight: 1
                        }
                      ]
                    }
                  }
                }
              }
            },
            401: {
              $ref: "#/components/responses/Unauthorized"
            }
          },
          description: "Get all flights",
          tags: [
            "Flight"
          ],
          parameters: [],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
        parameters: [],
        post: {
          summary: 'Adding flight',
          operationId: 'Create-flight',
          responses: {
            200: {
              description: 'Flight added',
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                      details: {
                        type: 'string',
                      },
                    },
                  },
                  examples: {
                    Unauthorized: {
                      value: {
                        code: 'UNAUTHORIZED',
                        message: 'Not Authorized, please log in',
                        details: "Cannot read properties of undefined (reading 'sub')",
                      },
                    },
                  },
                },
              },
            },
            403: {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                      details: {
                        type: 'string',
                      },
                    },
                  },
                  examples: {
                    Error: {
                      value: {
                        code: 'FORBIDDEN',
                        message: 'Error in creating flight',
                        details: 'You are not allowed to create a flight for this pilot',
                      },
                    },
                  },
                },
              },
            },
          },
          description: 'Create flight',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    timeframe: {
                      type: 'string',
                    },
                    date: {
                      type: 'string',
                    },
                    type: {
                      type: 'string',
                    },
                    plane: {
                      type: 'string',
                    },
                    departure: {
                      type: 'string',
                    },
                    arrival: {
                      type: 'string',
                    },
                    PIC: {
                      type: 'integer',
                    },
                    CoPilot: {
                      type: 'null',
                    },
                  },
                },
                examples: {
                  'Adding flight': {
                    value: {
                      timeframe: '08:00 - 09:00',
                      date: '2021-11-21T23:00:00.000Z',
                      type: 'Training',
                      plane: 'OO-EBU',
                      departure: 'EBBR',
                      arrival: 'EBCI',
                      PIC: 1,
                      CoPilot: null,
                    },
                  },
                },
              },
            },
            description: 'Flight information',
          },
          tags: ['Flight'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/flights/{id}': {
        parameters: [
          {
            schema: {
              type: 'string',
            },
            name: 'id',
            in: 'path',
            required: true,
          },
        ],
        delete: {
          summary: 'Deleting a flight',
          operationId: 'delete-flights-id',
          responses: {
            204: {
              description: 'Deleted flight',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          description: 'Delete a flight',
          tags: ['Flight'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/flights/categories/': {
        get: {
          summary: 'Category info',
          tags: ['Flight'],
          responses: {
            200: {
              description: 'Recieved category info',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'integer',
                    },
                  },
                  examples: {
                    'When no flights': {
                      value: [0, 0, 0],
                    },
                  },
                },
              },
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          operationId: 'get-Categories',
          description: 'Get per category amount of flights',
          security: [
            {
              "API-KEY": []
            }
          ]
        },
        parameters: [],
      },
      '/flights/stats/': {
        get: {
          summary: 'Get stats of pilot',
          tags: ['Flight'],
          responses: {
            200: {
              description: 'Got all stats',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'integer',
                    },
                  },
                  examples: {
                    '0 flights performed': {
                      value: [0, 0, 0],
                    },
                  },
                },
              },
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          operationId: 'get-stats',
          description: 'Get stats as in per month, per year and total ',
          security: [
            {
              "API-KEY": []
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {},
                },
              },
            },
          },
        },
        parameters: [],
      },
      '/flights/update': {
        put: {
          summary: 'Updating flight',
          operationId: 'put-flights-update',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                      },
                      timeframe: {
                        type: 'string',
                      },
                      date: {
                        type: 'string',
                      },
                      type: {
                        type: 'string',
                      },
                      plane: {
                        type: 'string',
                      },
                      departure: {
                        type: 'string',
                      },
                      arrival: {
                        type: 'string',
                      },
                      PIC: {
                        type: 'integer',
                      },
                      CoPilot: {
                        type: 'null',
                      },
                      flight: {
                        type: 'integer',
                      },
                    },
                  },
                  examples: {
                    'Example 1': {
                      value: {
                        id: 5,
                        timeframe: '08:00 - 09:00',
                        date: '2021-11-21T23:00:00.000Z',
                        type: 'Local',
                        plane: 'OO-EBU',
                        departure: 'EBBR',
                        arrival: 'EBCI',
                        PIC: 4,
                        CoPilot: null,
                        flight: 5,
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: '#/components/responses/Validation_Failed',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          description: 'Update a flight',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Flight',
                },
                examples: {
                  update: {
                    value: {
                      id: 4,
                      timeframe: '08:00 - 09:00',
                      date: '2021-11-21T23:00:00.000Z',
                      type: 'Local',
                      plane: 'OO-EBU',
                      departure: 'EBBR',
                      arrival: 'EBCI',
                      PIC: 4,
                      CoPilot: null,
                    },
                  },
                },
              },
            },
            description: 'Update info',
          },
          tags: ['Flight'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/licenses': {
        get: {
          summary: 'Get all licenses from pilot',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/License',
                  },
                  examples: {
                    License: {
                      value: [
                        {
                          id: 4,
                          Type: 'PPL',
                          ValidFrom: '2022-12-14T23:00:00.000Z',
                          validityInYears: 1,
                          idPilot: 4,
                        },
                      ],
                    },
                  },
                },
              },
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          operationId: 'get-license',
          description: 'Get all licenses from pilot',
          tags: ['License'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
        parameters: [],
        post: {
          summary: 'Adding license',
          operationId: 'post-licenses',
          responses: {
            204: {
              description: 'Flight added',
            },
            400: {
              $ref: '#/components/responses/Forbidden',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          description: 'Adding license',
          tags: ['License'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/licenses/{id}': {
        parameters: [
          {
            schema: {
              type: 'integer',
            },
            name: 'id',
            in: 'path',
            required: true,
            description: 'license id',
          },
        ],
        delete: {
          summary: 'delete license',
          operationId: 'delete-licenses-id',
          responses: {
            204: {
              description: 'No Content',
            },
            400: {
              $ref: '#/components/responses/Validation_Failed',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          description: 'Deletes the license with id',
          tags: ['License'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/pilots/': {
        get: {
          summary: 'Get pilots',
          tags: ['Pilots'],
          responses: {
            200: {
              description: 'List of pilots ',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Pilot',
                    },
                  },
                },
              },
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          operationId: 'get-pilots',
          description: 'Get all pilots',
          security: [
            {
              "API-KEY": []
            }
          ]
        },
        parameters: [],
        
      },
      '/pilots/info': {
        get: {
          summary: 'Pilot information',
          tags: ['Pilots'],
          responses: {
            200: {
              description: 'Pilot info',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Pilot',
                  },
                },
              },
            },
          },
          operationId: 'get-pilots-info',
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/pilots/register/': {
        get: {
          summary: 'Registry check',
          tags: ['Pilots'],
          responses: {
            200: {
              description: 'Return pilot',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Pilot',
                  },
                },
              },
            },
            403: {
              $ref: '#/components/responses/Forbidden',
            },
          },
          operationId: 'get-pilots-register',
          description:
            'Get request - returns pilot by auth0id.\nIf no pilot exists with auth0id, one will be created.',
            security: [
              {
                "API-KEY": []
              }
            ]
        },
        parameters: [],
        security: [
          {
            "API-KEY": []
          }
        ]
      },
      '/pilots/update': {
        put: {
          summary: 'Update pilot information',
          operationId: 'put-pilots-update',
          responses: {
            204: {
              description: 'Updated',
            },
            401: {
              $ref: '#/components/responses/Unauthorized',
            },
          },
          description: 'Update pilot information',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Pilot',
                },
              },
            },
          },
          tags: ['Pilots'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/planes/': {
        get: {
          summary: 'Get flown planes',
          tags: ['Planes'],
          responses: {
            200: {
              description: 'Recieved',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Plane',
                    },
                  },
                  examples: {
                    'Plane test': {
                      value: [
                        {
                          Registration: 'OO-VMD',
                          Type: 'Test',
                          MaxFuel: 10,
                          MaxWeight: 128,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          operationId: 'get-planes',
          description: 'Get all planes flown by pilot',
          security: [
            {
              "API-KEY": []
            }
          ]
        },
        parameters: [],
        post: {
          summary: 'Add plane',
          operationId: 'post-planes',
          responses: {
            204: {
              description: 'No Content',
            },
            400: {
              $ref: '#/components/responses/Validation_Failed',
            },
          },
          description: 'Add a plane',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Plane',
                },
              },
            },
            description: 'Plane information',
          },
          tags: ['Planes'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/planes/edit/': {
        put: {
          summary: 'Edit plane information',
          operationId: 'put-planes-edit',
          responses: {
            200: {
              description: 'Plane edited',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Plane',
                  },
                  examples: {
                    'Plane OO-VMC': {
                      value: {
                        Registration: 'OO-VMC',
                        Type: 'PA28',
                        MaxFuel: 10,
                        MaxWeight: 128,
                      },
                    },
                  },
                },
              },
            },
            400: {
              $ref: '#/components/responses/Validation_Failed',
            },
          },
          description: 'Edits plane information',
          tags: ['Planes'],
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
      '/planes/info/{id}': {
        parameters: [
          {
            schema: {
              type: 'string',
            },
            name: 'id',
            in: 'path',
            required: true,
            description: 'Registration plane',
          },
        ],
        get: {
          summary: 'Get plane by registration',
          tags: ['Planes'],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Plane',
                  },
                },
              },
            },
            400: {
              $ref: '#/components/responses/Validation_Failed',
            },
          },
          operationId: 'get-planes-info-id',
          description: 'Get plane by registration',
          security: [
            {
              "API-KEY": []
            }
          ]
        },
      },
    },
    components: {
      schemas: {
        Flight: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            timeframe: {
              type: 'string',
            },
            date: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
            plane: {
              type: 'string',
            },
            departure: {
              type: 'string',
            },
            arrival: {
              type: 'string',
            },
            PIC: {
              type: 'integer',
            },
            CoPilot: {
              type: 'null',
            },
            flight: {
              type: 'integer',
            },
          },
          description: 'Flight data',
          title: 'Flight',
        },
        License: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
              },
              Type: {
                type: 'string',
              },
              ValidFrom: {
                type: 'string',
              },
              validityInYears: {
                type: 'integer',
              },
              idPilot: {
                type: 'integer',
              },
            },
          },
          examples: [
            [
              {
                id: 4,
                Type: 'Test',
                ValidFrom: '2022-12-14T23:00:00.000Z',
                validityInYears: 0,
                idPilot: 4,
              },
            ],
          ],
          description: 'License example',
          title: 'License',
        },
        Pilot: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            fName: {
              type: 'string',
            },
            lName: {
              type: 'string',
            },
            birthday: {
              type: 'object',
              description: 'Date object',
            },
            auth0id: {
              type: 'string',
            },
          },
          title: 'Pilot',
          description: 'Pilot',
        },
        Plane: {
          type: 'object',
          properties: {
            Registration: {
              type: 'string',
            },
            Type: {
              type: 'string',
            },
            MaxFuel: {
              type: 'integer',
            },
            MaxWeight: {
              type: 'integer',
            },
          },
          title: 'Plane',
          description: 'Plane',
        },
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized\n',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                  details: {
                    type: 'string',
                  },
                },
              },
              examples: {
                Unauthorized: {
                  value: {
                    code: 'UNAUTHORIZED',
                    message: 'Not Authorized, please log in',
                    details: "Cannot read properties of undefined (reading 'sub')",
                  },
                },
              },
            },
            'application/xml': {
              schema: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: {
                properties: {
                  id: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        Validation_Failed: {
          description: 'Example response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                  details: {
                    type: 'string',
                  },
                },
              },
              examples: {
                'validation failed, no flight available for id': {
                  value: {
                    code: 'VALIDATION_FAILED',
                    message: 'Error in getting flight by id',
                    details: 'There is no flight with id 1',
                  },
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        'API-KEY': {
          name: 'Authorization',
          type: 'apiKey',
          in: 'header',
          description: "This apiKey will be automatically assigned when logging in on pilot logger.\n\n    ! IMPORTANT !\n    When filling in the token, you must provide the token in following structure.    \n`Bearer <Acces token>`"
        },
      },
    },
  },
  apis: ['../src/rest/*.js'],
  
};
