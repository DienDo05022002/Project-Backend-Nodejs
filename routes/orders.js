var express = require('express');
var router = express.Router();
const yup = require('yup');
const { MongoClient } = require('mongodb');

const { validateSchema, ordersSchema } = require('./schemas.yup');
const { insertDocument, updateDocument, findDocument, findDocuments, deleteDocument } = require('../helpers/MongoDbHelper');
const COLLECTION_NAME = 'orders';

/* GET home page. */
router.get('/', async (req, res) => {
  const data = req.body;
  findDocuments(data, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, data, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});
// ------------------------------------------------------------------------------------------------
// QUESTIONS 7
// ------------------------------------------------------------------------------------------------
router.get('/questions/7', function (req, res, next) {
  const query = {
    status: 'COMPLETED',
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 8
// ------------------------------------------------------------------------------------------------
router.get('/questions/8', function (req, res, next) {
  const today = new Date();
  const query = {
    $and: [
      {
        status: 'COMPLETED'
      },
      {
        $expr: {
          $and: [{ $eq: [{ $dayOfMonth: '$createdDate' }, { $dayOfMonth: today }] }, { $eq: [{ $month: '$createdDate' }, { $month: today }] }],
        }
      }
    ]
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 9
// ------------------------------------------------------------------------------------------------
router.get('/questions/9', function (req, res, next) {
  const query = {
    status: 'CANCELED',
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 10
// ------------------------------------------------------------------------------------------------
router.get('/questions/10', function (req, res, next) {
  const today = new Date();
  const query = {
    $and: [
      {
        status: 'CANCELED'
      },
      {
        $expr: {
          $and: [{ $eq: [{ $dayOfMonth: '$createdDate' }, { $dayOfMonth: today }] }, { $eq: [{ $month: '$createdDate' }, { $month: today }] }],
        }
      }
    ]
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


// ------------------------------------------------------------------------------------------------
// QUESTIONS 11
// ------------------------------------------------------------------------------------------------
router.get('/questions/11', function (req, res, next) {
  const query = {
    $and: [
      {
        paymentType: 'CASH',
      },
    ],
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 12
// ------------------------------------------------------------------------------------------------
router.get('/questions/12', function (req, res, next) {
  const query = {
    $and: [
      {
        paymentType: 'CREDIT CARD',
      },
    ],
  };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 13
// ------------------------------------------------------------------------------------------------
router.get('/questions/13', function (req, res, next) {
  const text = 'Hà Nội';
  const query = { shippingAddress: { $regex: `${text}` } };

  findDocuments({ query }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 16
// ------------------------------------------------------------------------------------------------
router.get('/questions/16', function (req, res, next) {
  const aggregate = [
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: '_id',
        as: 'order-customer',
      },
    },
    // {
    //   $addFields: { customer: { $first: '$_customer' } },
    // },
  ];

  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 20
// ------------------------------------------------------------------------------------------------
router.get('/questions/20', function (req, res, next) {
  const aggregate = [
    {$match: 
        {$expr: 
          { $and: [{ $gte: [{ $dayOfMonth: '$createdDate' }, 1] }, { $lt: [{ $dayOfMonth: '$createdDate' }, 10] }]
      }
    },},
    {
      $lookup: {
        from: 'products',
        localField: 'orderDetails.productId',
        foreignField: '_id',
        as: 'orders-products(các hàng hóa bán trong ngày 1-10 #createdDate)',
      },
    },
  ];

  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 21
// ------------------------------------------------------------------------------------------------
router.get('/questions/21', function (req, res, next) {
  const aggregate = [
    {$match: 
        {$expr: 
          { $and: [{ $gte: [{ $dayOfMonth: '$createdDate' }, 10] }, { $lt: [{ $dayOfMonth: '$createdDate' }, 20] }]
      }
    },},
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: '_id',
        as: 'orders-customer(các khách hàng mua hàng trong ngày 10-20 )',
      },
    },
  ];

  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
// ------------------------------------------------------------------------------------------------
// QUESTIONS 23
// ------------------------------------------------------------------------------------------------
router.get('/questions/23', async (req, res) => {
  const aggregate = [
    {
      $lookup: {
        from: 'products',
        localField: 'orderDetails.productId',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: {
        path: '$orderDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$_id',
        orderDetails: {
          $push: {
            sumPrice: {
              name: '$products.name', 
              price: '$orderDetails.price',
              quantiny: '$orderDetails.quantiny',
              sumPriceOrder: {$sum: { $multiply: ['$orderDetails.price', '$orderDetails.quantiny'] }}
            }
          }
        }
      }
    }
  ];
  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

// TÌM THEO ID
const getByIdSchema = yup.object({
  params: yup.object({
    id: yup.string().required(),
  }),
});

router.get('/:id', validateSchema(getByIdSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await findDocument(id, COLLECTION_NAME);

    if (result) {
      res.json({ ok: true, result });
    } else {
      res.json({ ok: false, result });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// THÊM MỚI
router.post('/', validateSchema(ordersSchema), async (req, res) => {
  try {
    const data = req.body;
    const result = await insertDocument(data, COLLECTION_NAME);
    res.status(201).json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// SỬA
router.patch('/:id', async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const result = await updateDocument(id, data, COLLECTION_NAME);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

// XÓA
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDocument(id, COLLECTION_NAME);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;