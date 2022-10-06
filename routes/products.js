var express = require('express');
var router = express.Router();
const yup = require('yup');
const { MongoClient } = require('mongodb');

const { validateSchema, productsSchema } = require('./schemas.yup');
const { insertDocument, updateDocument, findDocument, findDocuments, deleteDocument } = require('../helpers/MongoDbHelper');
const COLLECTION_NAME = 'products';

const lookupCategory = {
  $lookup: {
    from: 'categories', // foreign collection name
    localField: 'categoryId',
    foreignField: '_id',
    as: 'product-category', // alias
  },
};

const lookupSupplier = {
  $lookup: {
    from: 'suppliers', // foreign collection name
    localField: 'supplierId',
    foreignField: '_id',
    as: 'product-supplier', // alias
  },
};
/* GET home page. */
router.get('/', async (req, res) => {
  // const aggregate = [
  //   {
  //     $match: { description: "Max" }
  //   },
  // ];
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
// QUESTIONS 1
// ------------------------------------------------------------------------------------------------
router.get('/questions/1', async (req, res) => {
  const aggregate = [
    {
      $match: { discount: { $lte: 10 } }
    },
  ];
  const data = req.body;
  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, result: result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 2
// ------------------------------------------------------------------------------------------------
router.get('/questions/2', async (req, res) => {
  const aggregate = [
    {
      $match: { stock: { $lte: 5 } }
    },
  ];
  const data = req.body;
  findDocuments({ aggregate: aggregate }, COLLECTION_NAME)
    .then((result) => {
      res.status(200).json({ ok: true, result: result });
    })
    .catch((error) => {
      res.status(500).json({ ok: false, error });
    });
});

// ------------------------------------------------------------------------------------------------
// QUESTIONS 3
// ------------------------------------------------------------------------------------------------
router.get('/questions/3', async (req, res) => {
  const s = { $subtract: [100, '$discount'] }; // (100 - 5)
  const m = { $multiply: ['$price', s] }; // price * 95
  const d = { $divide: [m, 100] }; // price * 95 / 100
  const aggregate = [
    {
      $match: { $expr: { $lte: [d, 1000000] } }
    },
    lookupCategory,
    lookupSupplier,
    {
      $addFields: { discountedPrice: d, category: { $first: '$category' }, supplier: { $first: '$supplier' } },
    },
  ];
  const data = req.body;
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
router.post('/', validateSchema(productsSchema), async (req, res) => {
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